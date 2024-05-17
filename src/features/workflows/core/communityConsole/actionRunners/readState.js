import {CCApi} from '../../../../../common/api.js';
import {getAuthUser} from '../../../../../common/communityConsoleUtils.js';

export default class ReadStateRunner {
  execute(readState, thread) {
    // Although this should in theory be the last message ID, it seems like
    // setting 0 marks the entire thread as read anyways.
    const lastMessageId = readState ? '0' : '-1';

    return CCApi(
        'SetUserReadStateBulk', {
          // bulkItem:
          1: [{
            1: thread.forumId,
            2: thread.threadId,
            3: lastMessageId,
          }],
        },
        /* authenticated = */ true, getAuthUser());
  }
}
