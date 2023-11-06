import {MDCTooltip} from '@material/tooltip';
import {waitFor} from 'poll-until-promise';

import {parseUrl} from '../../../common/commonUtils.js';
import OptionsWatcher from '../../../common/optionsWatcher.js';

import {kViewThreadResponse} from './consts.js';
import ProfileInfoHandler from './handlers/profile.js';
import ThreadListInfoHandler from './handlers/threadList.js';
import ExpandedThreadListExtraInfoInjection from './injections/expandedThreadList.js';
import ProfileAbuseExtraInfoInjection from './injections/profileAbuse.js';
import ProfilePerForumStatsExtraInfoInjection from './injections/profilePerForumStats.js';
import ThreadListExtraInfoInjection from './injections/threadList.js';
import ThreadExtraInfoService from './services/thread.js';

export default class ExtraInfo {
  constructor() {
    this.optionsWatcher = new OptionsWatcher(['extrainfo', 'perforumstats']);

    const profileInfoHandler = new ProfileInfoHandler();
    const threadListInfoHandler = new ThreadListInfoHandler();

    this.profileAbuse = new ProfileAbuseExtraInfoInjection(
        profileInfoHandler, this.optionsWatcher);
    this.profilePerForumStats = new ProfilePerForumStatsExtraInfoInjection(
        profileInfoHandler, this.optionsWatcher);
    this.expandedThreadList = new ExpandedThreadListExtraInfoInjection(
        threadListInfoHandler, this.optionsWatcher);
    this.threadList = new ThreadListExtraInfoInjection(
        threadListInfoHandler, this.optionsWatcher);

    this.lastThread = {
      body: {},
      id: -1,
      timestamp: 0,
    };

    this.setUpHandlers();
  }

  setUpHandlers() {
    window.addEventListener(kViewThreadResponse, e => {
      if (e.detail.id < this.lastThread.id) return;

      this.lastThread = {
        body: e.detail.body,
        id: e.detail.id,
        timestamp: Date.now(),
      };
    });
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

  // Whether |feature| is enabled
  isEnabled(feature) {
    return this.optionsWatcher.isEnabled(feature);
  }

  /**
   * Thread view functionality
   */
  injectAtQuestion(stateChips) {
    let currentPage = parseUrl(location.href);
    if (currentPage === false) {
      console.error('extraInfo: couldn\'t parse current URL:', location.href);
      return;
    }

    waitFor(
        () => {
          let now = Date.now();
          let threadInfo = this.lastThread.body['1']?.['2']?.['1'];
          if (now - this.lastThread.timestamp < 30 * 1000 &&
              threadInfo?.['1'] == currentPage.thread &&
              threadInfo?.['3'] == currentPage.forum)
            return Promise.resolve(this.lastThread);
          return Promise.reject(
              new Error('Didn\'t receive thread information'));
        },
        {
          interval: 500,
          timeout: 30 * 1000,
        })
        .then(thread => {
          const [info, tooltips] =
              ThreadExtraInfoService.getThreadChips(thread.body?.['1']);
          this.addExtraInfoElement(info, stateChips, false);
          for (const tooltip of tooltips) new MDCTooltip(tooltip);
        })
        .catch(err => {
          console.error(
              'extraInfo: error while injecting question extra info: ', err);
        });
  }

  injectAtQuestionIfEnabled(stateChips) {
    this.isEnabled('extrainfo').then(isEnabled => {
      if (isEnabled) return this.injectAtQuestion(stateChips);
    });
  }

  injectAtMessage(messageNode) {
    let currentPage = parseUrl(location.href);
    if (currentPage === false) {
      console.error('extraInfo: couldn\'t parse current URL:', location.href);
      return;
    }

    let footer = messageNode.querySelector('.footer-fill');
    if (!footer) {
      console.error('extraInfo: message doesn\'t have a footer:', messageNode);
      return;
    }

    const [type, index] =
        this.getMessageInfo(this.lastThread.body, messageNode);
    if (index == -1) {
      console.error('extraInfo: this.getMessageInfo() returned index -1.');
      return;
    }

    waitFor(
        () => {
          let now = Date.now();
          let threadInfo = this.lastThread.body['1']?.['2']?.['1'];
          if (now - this.lastThread.timestamp < 30 * 1000 &&
              threadInfo?.['1'] == currentPage.thread &&
              threadInfo?.['3'] == currentPage.forum) {
            const message = this.getMessageByTypeAndIndex(
                this.lastThread.body, type, index);
            if (message) return Promise.resolve(message);
          }

          return Promise.reject(new Error(
              'Didn\'t receive thread information (type: ' + type +
              ', index: ' + index + ')'));
        },
        {
          interval: 1000,
          timeout: 30 * 1000,
        })
        .then(message => {
          let info = [];

          const endPendingStateTimestampMicros = message['1']?.['17'];
          const [pendingStateInfo, pendingTooltip] =
              this.getPendingStateInfo(endPendingStateTimestampMicros);
          if (pendingStateInfo) info.push(pendingStateInfo);

          const itemMetadata = message['1']?.['5'];
          const mdInfo = ThreadExtraInfoService.getMetadataInfo(itemMetadata);
          info.push(...mdInfo);

          const liveReviewStatus = message['1']?.['36'];
          const [liveReviewInfo, liveReviewTooltip] =
              this.getLiveReviewStatusChip(liveReviewStatus);
          if (liveReviewInfo) info.push(liveReviewInfo);

          this.addExtraInfoElement(info, footer, true);
          if (pendingTooltip) new MDCTooltip(pendingTooltip);
          if (liveReviewTooltip) new MDCTooltip(liveReviewTooltip);
        })
        .catch(err => {
          console.error(
              'extraInfo: error while injecting message extra info: ', err);
        });
  }

  injectAtMessageIfEnabled(message) {
    this.isEnabled('extrainfo').then(isEnabled => {
      if (isEnabled) return this.injectAtMessage(message);
    });
  }
}
