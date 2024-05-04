import StatesExtraInfoService from './states.js';

export default class ThreadExtraInfoService {
  /**
   * Get a |chipContentList| array with the chips related to the thread, and a
   * |tooltips| array with the corresponding tooltips which should be
   * initialized after the chips are added to the DOM.
   */
  static getThreadChips(thread) {
    let chips = [];
    let tooltips = [];

    const endPendingStateTimestampMicros = thread?.['2']?.['39'];
    const [pendingStateInfo, pendingTooltip] =
        StatesExtraInfoService.getPendingStateChip(
            endPendingStateTimestampMicros);
    if (pendingStateInfo) chips.push(pendingStateInfo);
    if (pendingTooltip) tooltips.push(pendingTooltip);

    chips.push(...this.getTrendingChips(thread));

    const itemMetadata = thread?.['2']?.['12'];
    chips.push(...StatesExtraInfoService.getMetadataChips(itemMetadata));

    const liveReviewStatus = thread?.['2']?.['38'];
    const [liveReviewInfo, liveReviewTooltip] =
        StatesExtraInfoService.getLiveReviewStatusChip(liveReviewStatus);
    if (liveReviewInfo) chips.push(liveReviewInfo);
    if (liveReviewTooltip) tooltips.push(liveReviewTooltip);

    return [chips, tooltips];
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
