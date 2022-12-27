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
};

export default loadMoreThread;
