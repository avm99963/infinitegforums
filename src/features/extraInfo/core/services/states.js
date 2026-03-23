import {createPlainTooltip} from '../../../../common/tooltip.js';
import {kItemMetadataState, kItemMetadataStateI18n} from '../consts.js';

const REVIEW_QUEUE_LIVE = 1;

export default class StatesExtraInfoService {
  static getPendingStateChip(endPendingStateTimestampMicros) {
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

  static getLiveReviewStatusChip(liveReviewStatus, reviewStatus) {
    const liveReviewInfo = this.getLegacyLiveReviewInfo(liveReviewStatus) ?? this.getLiveReviewInfo(reviewStatus);
    if (!liveReviewInfo) {
      return [null, null];
    }

    const [label, labelClass] = this.getLiveReviewStatusLabel(liveReviewInfo.verdict);
    if (!label || !labelClass) return [null, null];

    const date = (new Date(Math.floor(liveReviewInfo.timestamp / 1e3))).toLocaleString();

    let a = document.createElement('a');
    a.href = 'https://support.google.com/s/community/user/' + liveReviewInfo.reviewedBy;
    a.classList.add(labelClass);
    a.textContent = chrome.i18n.getMessage(
        'inject_extrainfo_message_livereviewverdict',
        [chrome.i18n.getMessage(
            'inject_extrainfo_message_livereviewverdict_' + label)]);
    let liveReviewTooltip = createPlainTooltip(a, date, false);
    return [a, liveReviewTooltip];
  }

  /**
   * Gets the live review info (if available) from the old
   * ForumMessage.live_review_status field.
   */
  static getLegacyLiveReviewInfo(liveReviewStatus) {
    const verdict = liveReviewStatus?.['1'];
    if (!verdict) {
      return undefined;
    }

    return {
      verdict,
      reviewedBy: liveReviewStatus?.['2'],
      timestamp: liveReviewStatus?.['3'],
    };
  }

  /**
   * Gets the live review label (if available) from the
   * ForumMessage.review_status field.
   */
  static getLiveReviewInfo(reviewStatus) {
    const reviewQueue = reviewStatus?.['1'];
    if (reviewQueue !== REVIEW_QUEUE_LIVE) {
      return undefined;
    }

    return {
      verdict: reviewStatus?.['6'],
      reviewedBy: reviewStatus?.['2'],
      timestamp: reviewStatus?.['3'],
    };
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

  static getMetadataChips(itemMetadata) {
    return [
      this.getStateChip(itemMetadata),
      this.getShadowBlockChip(itemMetadata),
    ].filter(chip => chip !== null);
  }

  static getStateChip(itemMetadata) {
    const state = itemMetadata?.['1'];
    if (!state || state == 1) return null;

    let stateLocalized;
    if (kItemMetadataStateI18n[state]) {
      const stateI18nKey =
          'inject_extrainfo_message_state_' + kItemMetadataStateI18n[state];
      stateLocalized = chrome.i18n.getMessage(stateI18nKey) ?? state;
    } else {
      stateLocalized = kItemMetadataState[state] ?? state;
    }

    const span = document.createElement('span');
    span.textContent = chrome.i18n.getMessage(
        'inject_extrainfo_message_state', [stateLocalized]);
    span.title = kItemMetadataState[state] ?? state;
    return span;
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
}
