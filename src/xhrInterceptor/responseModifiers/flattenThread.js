import {kAdditionalInfoClass} from '../../features/flattenThreads/core/flattenThreads.js';
import GapModel from '../../models/Gap.js';
import MessageModel from '../../models/Message.js';
import StartupDataModel from '../../models/StartupData.js';
import ThreadModel from '../../models/Thread.js';

const currentUser = StartupDataModel.buildFromCCDOM().getCurrentUserModel();

const flattenThread = {
  urlRegex: /api\/ViewThread/i,
  featureGated: true,
  features: ['flattenthreads', 'flattenthreads_switch_enabled'],
  isEnabled(options) {
    return options['flattenthreads'] &&
        options['flattenthreads_switch_enabled'];
  },
  async interceptor(_request, response) {
    if (!response[1]?.[40]) return response;

    const thread = new ThreadModel(response[1]);

    // Do the actual flattening
    const originalMogs = thread.getMessageOrGapModels();
    let extraMogs = [];
    originalMogs.forEach(mog => {
      if (mog instanceof GapModel) return;
      const cogs = mog.getCommentsAndGaps();
      extraMogs = extraMogs.concat(cogs);
      mog.clearCommentsAndGaps();
    });
    const mogs = originalMogs.concat(extraMogs);

    // Add some message data to the payload so the extension can show the parent
    // comment/reply in the case of comments.
    let prevReplyId;
    let prevReplyParentId;
    mogs.forEach(m => {
      const info = this.getAdditionalInformation(
          m, mogs, prevReplyId, prevReplyParentId);
      prevReplyId = m.getId();
      prevReplyParentId = info.parentId;

      const extraInfoEl = document.createElement('code');
      extraInfoEl.textContent = JSON.stringify(info);
      extraInfoEl.setAttribute('style', 'display: none');
      extraInfoEl.classList.add(kAdditionalInfoClass);
      m.newPayload = m.getPayload() + extraInfoEl.outerHTML;
    });
    mogs.forEach(m => m.setPayload(m.newPayload));

    // Clear parent_message_id fields
    mogs.forEach(m => m.clearParentMessageId());

    // Sort the messages by date
    mogs.sort((a, b) => {
      const c = a instanceof MessageModel ? a.getCreatedMicroseconds() :
                                            a.getStartTimestamp();
      const d = b instanceof MessageModel ? b.getCreatedMicroseconds() :
                                            b.getStartTimestamp();
      const diff = c - d;
      return diff > 0 ? 1 : diff < 0 ? -1 : 0;
    });

    thread.setRawCommentsAndGaps(mogs.map(mog => mog.toRawMessageOrGap()));

    // Set last_message to the last message after sorting
    thread.setLastMessage(thread.getRawCommentsAndGaps().slice(-1)?.[1]);

    // Set num_messages to the updated value, since we've flattened the replies.
    thread.setNumMessages(thread.getRawCommentsAndGaps().length);

    response[1] = thread.toRawThread();
    return response;
  },
  getAdditionalInformation(message, mogs, prevReplyId, prevReplyParentId) {
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
    if (parentId == prevReplyParentId && prevReplyParentId)
      prevId = prevReplyId;
    else
      prevId = parentId;

    const prevMessage = prevId ? mogs.find(m => m.getId() == prevId) : null;

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
  },
};

export default flattenThread;
