import {kAdditionalInfoPrefix} from '../../contentScripts/communityConsole/flattenThreads/flattenThreads.js';
import GapModel from '../../models/Gap.js';
import MessageModel from '../../models/Message.js';

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

    // Do the actual flattening
    const originalMogs =
        MessageModel.mapToMessageOrGapModels(response[1][40] ?? []);
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

      const span = document.createElement('span');
      span.textContent = kAdditionalInfoPrefix + JSON.stringify(info);
      span.setAttribute('style', 'display: none');
      m.newPayload = m.getPayload() + span.outerHTML;
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

    response[1][40] = mogs.map(mog => mog.toRawMessageOrGap());

    // Set last_message to the last message after sorting
    if (response[1]?.[17]?.[3])
      response[1][17][3] = response[1][40].slice(-1)?.[1];

    // Set num_messages to the updated value, since we've flattened the replies.
    response[1][8] = response[1][40].length;
    return response;
  },
  getAdditionalInformation(message, mogs, prevReplyId, prevReplyParentId) {
    const id = message.getId();
    const parentId = message.getParentMessageId();
    const authorName = message.getAuthor()?.[1]?.[1];
    if (!parentId) {
      return {
        isComment: false,
        id,
        authorName,
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
    };
  }
};

export default flattenThread;
