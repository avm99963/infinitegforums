import {
  ProtobufNumber,
  ProtobufObject,
} from '../../common/protojs/protojs.types';
import { kAdditionalInfoClass } from '../../features/flattenThreads/core/flattenThreads.js';
import GapModel from '../../models/Gap';
import MessageModel from '../../models/Message';
import StartupDataModel from '../../models/StartupData';
import ThreadModel from '../../models/Thread';
import { Modifier } from '../responseModifier/types';

const currentUser = StartupDataModel.buildFromCCDOM().getCurrentUserModel();

const flattenThread: Modifier = {
  urlRegex: /api\/ViewThread/i,
  isEnabled(optionsConfiguration) {
    return (
      optionsConfiguration.isEnabled('flattenthreads') &&
      optionsConfiguration.isEnabled('flattenthreads_switch_enabled')
    );
  },
  async interceptor(response) {
    if (!response[1]?.[40]) return response;

    const thread = new ThreadModel(response[1]);

    // Do the actual flattening
    const originalMogs = thread.getMessageOrGapModels();
    let extraMogs: Array<MessageModel | GapModel> = [];
    originalMogs.forEach((mog) => {
      if (mog instanceof GapModel) return;
      const cogs = mog.getCommentsAndGaps();
      extraMogs = extraMogs.concat(cogs);
      mog.clearCommentsAndGaps();
    });
    const mogs = originalMogs.concat(extraMogs);

    // Add some message data to the payload so the extension can show the parent
    // comment/reply in the case of comments.
    const newPayloads: Record<string, string> = {};
    let prevReplyId: ProtobufNumber | undefined = undefined;
    let prevReplyParentId: ProtobufNumber | undefined = undefined;
    mogs.forEach((m) => {
      if (m instanceof GapModel) return;

      const info = getAdditionalInformation(
        m,
        mogs,
        prevReplyId,
        prevReplyParentId,
      );
      prevReplyId = m.getId();
      prevReplyParentId = info.isComment ? info.parentId : undefined;

      const extraInfoEl = document.createElement('code');
      extraInfoEl.textContent = JSON.stringify(info);
      extraInfoEl.setAttribute('style', 'display: none');
      extraInfoEl.classList.add(kAdditionalInfoClass);
      newPayloads[m.getId()] = m.getPayload() + extraInfoEl.outerHTML;
    });
    mogs.forEach(
      (m) => m instanceof MessageModel && m.setPayload(newPayloads[m.getId()]),
    );

    // Clear parent_message_id fields
    mogs.forEach((m) => m instanceof MessageModel && m.clearParentMessageId());

    // Sort the messages by date
    mogs.sort((a, b) => {
      const c =
        a instanceof MessageModel
          ? a.getCreatedMicroseconds()
          : a.getStartTimestamp();
      const d =
        b instanceof MessageModel
          ? b.getCreatedMicroseconds()
          : b.getStartTimestamp();
      const diff = c - d;
      return diff > 0 ? 1 : diff < 0 ? -1 : 0;
    });

    thread.setRawCommentsAndGaps(mogs.map((mog) => mog.toRawMessageOrGap()));

    // Set last_message to the last message after sorting
    thread.setLastMessage(thread.getRawCommentsAndGaps().slice(-1)?.[1]);

    // Set num_messages to the updated value, since we've flattened the replies.
    thread.setNumMessages(thread.getRawCommentsAndGaps().length);

    response[1] = thread.toRawThread();
    return response;
  },
};

interface BaseAdditionalInformation {
  id: ProtobufNumber;
  authorName: string;
  canComment: boolean;
}

type CommentAdditionalInformation =
  | {
      isComment: false;
    }
  | {
      isComment: true;
      parentId: ProtobufNumber;
      prevMessage: {
        id: ProtobufNumber;
        payload: string;
        author: ProtobufObject | null;
      };
    };

export type AdditionalInformation = BaseAdditionalInformation &
  CommentAdditionalInformation;

function getAdditionalInformation(
  message: MessageModel,
  mogs: Array<MessageModel | GapModel>,
  prevReplyId: ProtobufNumber | undefined,
  prevReplyParentId: ProtobufNumber | undefined,
): AdditionalInformation {
  const id = message.getId();
  const parentId = message.getParentMessageId();
  const authorName = message.getAuthor()?.[1]?.[1];
  const canComment = message.canComment(currentUser);
  if (!parentId) {
    return {
      isComment: false,
      id,
      authorName,
      canComment,
    };
  }

  let prevId;
  if (parentId == prevReplyParentId && prevReplyParentId) {
    prevId = prevReplyId;
  } else {
    prevId = parentId;
  }

  const prevMessage = prevId
    ? mogs.find(
        (m): m is MessageModel =>
          m instanceof MessageModel && m.getId() == prevId,
      )
    : null;

  return {
    isComment: true,
    id,
    authorName,
    parentId,
    prevMessage: {
      id: prevId,
      payload: prevMessage?.getPayload(),
      author: prevMessage?.getAuthor(),
    },
    canComment,
  };
}

export default flattenThread;
