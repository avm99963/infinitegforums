import {kAdditionalInfoPrefix} from '../../contentScripts/communityConsole/flattenThreads/flattenThreads.js';
import GapModel from '../../models/Gap.js';
import MessageModel from '../../models/Message.js';

const loadMoreThread = {
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
    mogs.forEach(m => {
      const info = this.getAdditionalInformation(m, mogs);
      const span = document.createElement('span');
      span.textContent = kAdditionalInfoPrefix + JSON.stringify(info);
      span.setAttribute('style', 'display: none');
      m.newPayload = m.getPayload() + span.outerHTML;
    });
    mogs.forEach(m => m.setPayload(m.newPayload));

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

    // Set num_messages to the updated value, since we've flattened the replies.
    response[1][8] = response[1][40].length;
    return response;
  },
  getAdditionalInformation(message, mogs) {
    const id = message.getId();
    const parentId = message.getParentMessageId();
    const parentMessage =
        parentId ? mogs.find(m => m.getId() === parentId) : null;
    if (!parentMessage) {
      return {
        isComment: false,
        id,
      };
    }

    return {
      isComment: true,
      id,
      parentMessage: {
        id: parentId,
        payload: parentMessage.getPayload(),
        author: parentMessage.getAuthor(),
      },
    };
  }
};

export default loadMoreThread;
