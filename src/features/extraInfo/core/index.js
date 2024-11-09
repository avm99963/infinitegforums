import PartialOptionsWatcher from '../../../common/options/partialOptionsWatcher.js';

import ProfileInfoHandler from './infoHandlers/profile.js';
import ThreadInfoHandler from './infoHandlers/thread.js';
import ThreadListInfoHandler from './infoHandlers/threadList.js';
import ExpandedThreadListExtraInfoInjection from './injections/expandedThreadList.js';
import ProfileAbuseExtraInfoInjection from './injections/profileAbuse.js';
import ProfilePerForumStatsExtraInfoInjection from './injections/profilePerForumStats.js';
import ThreadCommentExtraInfoInjection from './injections/threadComment.js';
import ThreadListExtraInfoInjection from './injections/threadList.js';
import ThreadQuestionExtraInfoInjection from './injections/threadQuestion.js';
import ThreadReplyExtraInfoInjection from './injections/threadReply.js';

export default class ExtraInfo {
  setUp() {
    const optionsWatcher = new PartialOptionsWatcher(['extrainfo', 'perforumstats']);

    const profileInfoHandler = new ProfileInfoHandler();
    const threadInfoHandler = new ThreadInfoHandler();
    const threadListInfoHandler = new ThreadListInfoHandler();

    this.profileAbuse =
        new ProfileAbuseExtraInfoInjection(profileInfoHandler, optionsWatcher);
    this.profilePerForumStats = new ProfilePerForumStatsExtraInfoInjection(
        profileInfoHandler, optionsWatcher);
    this.threadQuestion =
        new ThreadQuestionExtraInfoInjection(threadInfoHandler, optionsWatcher);
    this.threadReply =
        new ThreadReplyExtraInfoInjection(threadInfoHandler, optionsWatcher);
    this.threadComment =
        new ThreadCommentExtraInfoInjection(threadInfoHandler, optionsWatcher);
    this.expandedThreadList = new ExpandedThreadListExtraInfoInjection(
        threadListInfoHandler, optionsWatcher);
    this.threadList =
        new ThreadListExtraInfoInjection(threadListInfoHandler, optionsWatcher);
  }

  injectAbuseChipsAtProfileIfEnabled(card) {
    this.profileAbuse.injectIfEnabled({card});
  }

  injectAtThreadListIfEnabled(li) {
    const injectionDetails = this.threadList.getInjectionDetails(li);
    this.threadList.injectIfEnabled(injectionDetails);
  }

  injectAtExpandedThreadListIfEnabled(toolbelt) {
    const injectionDetails =
        this.expandedThreadList.getInjectionDetails(toolbelt);
    this.expandedThreadList.injectIfEnabled(injectionDetails);
  }

  injectPerForumStatsIfEnabled(chart) {
    this.profilePerForumStats.injectIfEnabled({chart});
  }

  injectAtQuestionIfEnabled(stateChips) {
    this.threadQuestion.injectIfEnabled({stateChips, isMessageNode: false});
  }

  injectAtReplyIfEnabled(messageNode) {
    this.threadReply.injectIfEnabled({messageNode, isMessageNode: true});
  }

  injectAtCommentIfEnabled(messageNode) {
    this.threadComment.injectIfEnabled({messageNode, isMessageNode: true});
  }
}
