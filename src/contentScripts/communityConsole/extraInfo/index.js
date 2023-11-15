import OptionsWatcher from '../../../common/optionsWatcher.js';

import ProfileInfoHandler from './handlers/profile.js';
import ThreadInfoHandler from './handlers/thread.js';
import ThreadListInfoHandler from './handlers/threadList.js';
import ExpandedThreadListExtraInfoInjection from './injections/expandedThreadList.js';
import ProfileAbuseExtraInfoInjection from './injections/profileAbuse.js';
import ProfilePerForumStatsExtraInfoInjection from './injections/profilePerForumStats.js';
import ThreadListExtraInfoInjection from './injections/threadList.js';
import ThreadMessageExtraInfoInjection from './injections/threadMessage.js';
import ThreadQuestionExtraInfoInjection from './injections/threadQuestion.js';

export default class ExtraInfo {
  constructor() {
    const optionsWatcher = new OptionsWatcher(['extrainfo', 'perforumstats']);

    const profileInfoHandler = new ProfileInfoHandler();
    const threadInfoHandler = new ThreadInfoHandler();
    const threadListInfoHandler = new ThreadListInfoHandler();

    this.profileAbuse =
        new ProfileAbuseExtraInfoInjection(profileInfoHandler, optionsWatcher);
    this.profilePerForumStats = new ProfilePerForumStatsExtraInfoInjection(
        profileInfoHandler, optionsWatcher);
    this.threadQuestion =
        new ThreadQuestionExtraInfoInjection(threadInfoHandler, optionsWatcher);
    this.threadMessage =
        new ThreadMessageExtraInfoInjection(threadInfoHandler, optionsWatcher);
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

  injectAtMessageIfEnabled(messageNode) {
    this.threadMessage.injectIfEnabled({messageNode, isMessageNode: true});
  }
}
