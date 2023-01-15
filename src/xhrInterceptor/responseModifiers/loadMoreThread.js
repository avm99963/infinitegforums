import {CCApi} from '../../common/api.js';
import {getAuthUser} from '../../common/communityConsoleUtils.js';
import GapModel from '../../models/Gap.js';
import MessageModel from '../../models/Message.js';
import ThreadModel from '../../models/Thread.js';

const authuser = getAuthUser();

const loadMoreThread = {
  urlRegex: /api\/ViewThread/i,
  featureGated: true,
  features: ['flattenthreads', 'flattenthreads_switch_enabled'],
  isEnabled(options) {
    return options['flattenthreads'] &&
        options['flattenthreads_switch_enabled'];
  },
  async interceptor(request, response) {
    if (!response[1]?.[40]) return response;

    const forumId = response[1]?.[2]?.[1]?.[3];
    const threadId = response[1]?.[2]?.[1]?.[1];
    if (!forumId || !threadId) {
      console.error(
          '[loadMoreThread] Couldn\'t find forum id and thread id for:',
          request.$TWPTRequestUrl);
      return response;
    }

    const mogs = MessageModel.mapToMessageOrGapModels(response[1]?.[40] ?? []);
    response[1][40] = await this.loadGaps(forumId, threadId, mogs, 0);
    return response;
  },
  loadGaps(forumId, threadId, mogs, it) {
    if (it >= 10) {
      return Promise.reject(new Error(
          'loadGaps has been called for more than 10 times, ' +
          'which means we\'ve entered an infinite loop.'));
    }

    const messageOrGapPromises = [];
    messageOrGapPromises.push(
        Promise.resolve(mogs.filter(mog => mog !== undefined)));
    mogs.forEach(mog => {
      if (mog instanceof GapModel) {
        messageOrGapPromises.push(this.loadGap(forumId, threadId, mog));
      }
      if (mog instanceof MessageModel) {
        mog.getCommentsAndGaps().forEach(cog => {
          if (cog instanceof GapModel) {
            messageOrGapPromises.push(this.loadGap(forumId, threadId, cog));
          }
        });
      }
    });

    return Promise.all(messageOrGapPromises).then(res => {
      // #!if !production
      console.time('mergeMessages');
      // #!endif
      const mogs = ThreadModel.mergeMessageOrGapsMultiarray(res);
      // #!if !production
      console.timeEnd('mergeMessages');
      // #!endif

      if (mogs.some(mog => {
            return mog instanceof GapModel ||
                mog.getCommentsAndGaps().some(cog => cog instanceof GapModel);
          })) {
        return this.loadGaps(forumId, threadId, mogs, it + 1);
      }
      return mogs.map(message => message.toRawMessageOrGap());
    });
  },
  loadGap(forumId, threadId, gap) {
    return CCApi(
               'ViewThread', {
                 1: forumId,
                 2: threadId,
                 3: {
                   // options
                   1: {
                     // pagination
                     2: gap.getCount(),  // maxNum
                     7: {
                       // targetRange
                       1: gap.getStartMicroseconds(),  // startMicroseconds
                       2: gap.getEndMicroseconds(),    // endMicroseconds
                       3: gap.getParentId(),           // parentId
                     },
                   },
                   5: true,   // withUserProfile
                   10: true,  // withPromotedMessages
                 },
               },
               /* authenticated = */ true, authuser)
        .then(res => {
          return MessageModel.mapToMessageOrGapModels(res[1]?.[40] ?? []);
        });
  }
};

export default loadMoreThread;
