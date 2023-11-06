import {createPlainTooltip} from '../../../../common/tooltip.js';
import {kItemMetadataState, kItemMetadataStateI18n} from '../consts.js';

export default class ThreadExtraInfoService {
  /**
   * Get a |chipContentList| array with the chips related to the thread, and a
   * |tooltips| array with the corresponding tooltips which should be
   * initialized after the chips are added to the DOM.
   */
  static getThreadChips(thread) {
    let chips = [];
    let tooltips = [];

    const [pendingStateInfo, pendingTooltip] = this.getPendingStateChip(thread);
    if (pendingStateInfo) chips.push(pendingStateInfo);
    if (pendingTooltip) tooltips.push(pendingTooltip);

    chips.push(...this.getTrendingChips(thread));
    chips.push(...this.getMetadataChips(thread));

    const [liveReviewInfo, liveReviewTooltip] =
        this.getLiveReviewStatusChip(thread);
    if (liveReviewInfo) chips.push(liveReviewInfo);
    if (liveReviewTooltip) tooltips.push(liveReviewTooltip);

    return [chips, tooltips];
  }

  static getPendingStateChip(thread) {
    const endPendingStateTimestampMicros = thread?.['2']?.['39'];
    const endPendingStateTimestamp =
        Math.floor(endPendingStateTimestampMicros / 1e3);
    const now = Date.now();
    if (!endPendingStateTimestampMicros || endPendingStateTimestamp < now)
      return [null, null];

    const span = document.createElement('span');
    span.textContent =
        chrome.i18n.getMessage('inject_extrainfo_message_pendingstate');

    const date = new Date(endPendingStateTimestamp).toLocaleString();
    const pendingTooltip = createPlainTooltip(
        span,
        chrome.i18n.getMessage(
            'inject_extrainfo_message_pendingstate_tooltip', [date]),
        false);
    return [span, pendingTooltip];
  }

  static getTrendingChips(thread) {
    const chips = [];

    const isTrending = thread?.['2']?.['25'];
    const isTrendingAutoMarked = thread?.['39'];
    if (isTrendingAutoMarked)
      chips.push(document.createTextNode(
          chrome.i18n.getMessage('inject_extrainfo_thread_autotrending')));
    else if (isTrending)
      chips.push(document.createTextNode(
          chrome.i18n.getMessage('inject_extrainfo_thread_trending')));

    return chips;
  }

  static getMetadataChips(thread) {
    const itemMetadata = thread?.['2']?.['12'];

    return [
      this.getStateChip(itemMetadata),
      this.getShadowBlockChip(itemMetadata),
    ].filter(chip => chip !== null);
  }

  static getLiveReviewStatusChip(thread) {
    const liveReviewStatus = thread?.['2']?.['38'];
    const verdict = liveReviewStatus?.['1'];
    if (!verdict) return [null, null];

    const [label, labelClass] = this.getLiveReviewStatusLabel(verdict);
    if (!label || !labelClass) return [null, null];

    const reviewedBy = liveReviewStatus?.['2'];
    const timestamp = liveReviewStatus?.['3'];
    const date = (new Date(Math.floor(timestamp / 1e3))).toLocaleString();

    let a = document.createElement('a');
    a.href = 'https://support.google.com/s/community/user/' + reviewedBy;
    a.classList.add(labelClass);
    a.textContent = chrome.i18n.getMessage(
        'inject_extrainfo_message_livereviewverdict',
        [chrome.i18n.getMessage(
            'inject_extrainfo_message_livereviewverdict_' + label)]);
    let liveReviewTooltip = createPlainTooltip(a, date, false);
    return [a, liveReviewTooltip];
  }

  static getStateChip(itemMetadata) {
    const state = itemMetadata?.['1'];
    if (!state || state == 1) return null;

    const stateI18nKey =
        'inject_extrainfo_message_state_' + kItemMetadataStateI18n[state];
    const stateLocalized = chrome.i18n.getMessage(stateI18nKey) ?? state;

    const span = document.createElement('span');
    span.textContent = chrome.i18n.getMessage(
        'inject_extrainfo_message_state', [stateLocalized]);
    span.title = kItemMetadataState[state] ?? state;
    return span;
  }

  static getLiveReviewStatusLabel(verdict) {
    let label, labelClass;
    switch (verdict) {
      case 1:  // LIVE_REVIEW_RELEVANT
        label = 'relevant';
        labelClass = 'TWPT-extrainfo-good';
        break;

      case 2:  // LIVE_REVIEW_OFF_TOPIC
        label = 'offtopic';
        labelClass = 'TWPT-extrainfo-bad';
        break;

      case 3:  // LIVE_REVIEW_ABUSE
        label = 'abuse';
        labelClass = 'TWPT-extrainfo-bad';
        break;

      default:
        return [null, null];
    }
    return [label, labelClass];
  }

  static getShadowBlockChip(itemMetadata) {
    const shadowBlockInfo = itemMetadata?.['10'];
    const blockedTimestampMicros = shadowBlockInfo?.['2'];
    if (!blockedTimestampMicros) return null;

    const isBlocked = shadowBlockInfo?.['1'];
    let span = document.createElement('span');
    span.textContent = chrome.i18n.getMessage(
        'inject_extrainfo_message_shadowblock' +
        (isBlocked ? 'active' : 'notactive'));
    if (isBlocked) span.classList.add('TWPT-extrainfo-bad');
    return span;
  }

  static getThreadFromThreadList(threadList, currentThreadInfo) {
    return threadList?.find?.(thread => {
      const threadInfo = thread?.['2']?.['1'];
      const threadId = threadInfo?.['1'];
      const forumId = threadInfo?.['3'];
      return threadId == currentThreadInfo.thread &&
          forumId == currentThreadInfo.forum;
    });
  }
}
