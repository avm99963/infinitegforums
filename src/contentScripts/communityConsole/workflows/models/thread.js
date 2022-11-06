import {waitFor} from 'poll-until-promise';

import {CCApi} from '../../../../common/api.js';
import {parseUrl} from '../../../../common/commonUtils.js';
import {getAuthUser} from '../../../../common/communityConsoleUtils.js';

export default class Thread {
  constructor(forumId, threadId) {
    this.forumId = forumId;
    this.threadId = threadId;
    this._details = null;
  }

  static fromUrl(url) {
    const rawThread = parseUrl(url);
    if (!rawThread) return null;

    return new Thread(rawThread.forum, rawThread.thread);
  }

  loadThreadDetails() {
    if (this._details) return Promise.resolve(true);

    return waitFor(
               () => {
                 return CCApi(
                            'ViewForum', {
                              1: '0',  // forumID,
                              // options
                              2: {
                                3: false,   // withMessages
                                5: true,    // withUserProfile
                                6: false,   // withUserReadState
                                7: false,   // withStickyThreads
                                9: false,   // withRequestorProfile
                                10: false,  // withPromotedMessages
                                11: false,  // withExpertResponder
                                12: `forum:${this.forumId} thread:${
                                    this.threadId}`,  // forumViewFilters
                                16: false,            // withThreadNotes
                                17: false,  // withExpertReplyingIndicator
                              },
                            },
                            /* authenticated = */ true, getAuthUser())
                     .then(res => {
                       if (res?.['1']?.['2']?.length < 1)
                         throw new Error(
                             `Couldn't retrieve thread details (forum: ${
                                 this.forumId}, thread: ${this.thread}).`);

                       return res?.['1']?.['2']?.[0];
                     });
               },
               {
                 interval: 500,
                 timeout: 2000,
               })
        .then(thread => {
          this._details = thread;
          return true;
        });
  }

  get opName() {
    return this._details?.['4']?.['1']?.['1'];
  }

  get opUserId() {
    return this._details?.['4']?.['3'];
  }

  get forumTitle() {
    return this._details?.['23'];
  }

  get isRead() {
    return !!this._details?.['6'];
  }

  get isStarred() {
    return !!this._details?.['7']?.['1'];
  }

  get numMessages() {
    return this._details?.['8'];
  }

  get numAnswers() {
    return this._details?.['15'];
  }

  get numSuggestedAnswers() {
    return this._details?.['32'];
  }

  get title() {
    return this._details?.['2']?.['9'];
  }

  get payload() {
    return this._details?.['2']?.['13'];
  }

  // Accessors in the style of
  // https://support.google.com/communities/answer/9147001.
  get op_name() {
    return this.opName;
  }

  get forum_name() {
    return this.forumTitle;
  }
}
