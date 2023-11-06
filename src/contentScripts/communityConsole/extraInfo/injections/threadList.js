import {MDCTooltip} from '@material/tooltip';

import {parseUrl} from '../../../../common/commonUtils.js';
import {createExtBadge} from '../../utils/common.js';
import {kItemMetadataState, kItemMetadataStateI18n} from '../consts.js';
import ThreadExtraInfoService from '../services/thread.js';

import BaseExtraInfoInjection from './base.js';

export default class ThreadListExtraInfoInjection extends
    BaseExtraInfoInjection {
  getInjectionDetails(li) {
    const headerContent = li.querySelector(
        'ec-thread-summary .main-header .header a.header-content');
    if (headerContent === null) {
      throw new Error(
          `extraInfo: Header is not present in the thread item's DOM.`);
    }

    const threadInfo = parseUrl(headerContent.href);
    if (threadInfo === false)
      throw new Error(`extraInfo: Thread's link cannot be parsed.`);

    return {
      li,
      threadInfo,
      isExpanded: false,
    };
  }

  inject(threads, injectionDetails) {
    const thread = ThreadExtraInfoService.getThreadFromThreadList(
        threads, injectionDetails.threadInfo);

    const state = thread?.['2']?.['12']?.['1'];
    if (!state || [1, 13, 18, 9].includes(state)) return;

    const [label, badgeTooltip] = this.createLabelElement(state);
    const authorLine = this.getAuthorLine(injectionDetails.li);
    authorLine.prepend(label);

    new MDCTooltip(badgeTooltip);
  }

  createLabelElement(state) {
    const label = document.createElement('div');
    label.classList.add('TWPT-label');

    const [badge, badgeTooltip] = createExtBadge();

    let span = document.createElement('span');
    const stateI18nKey =
        'inject_extrainfo_message_state_' + kItemMetadataStateI18n[state];
    span.textContent = chrome.i18n.getMessage(stateI18nKey) ?? state;
    span.title = kItemMetadataState[state] ?? state;

    label.append(badge, span);

    return [label, badgeTooltip];
  }

  getAuthorLine(li) {
    const authorLine = li.querySelector(
        'ec-thread-summary .header-content .top-row .author-line');
    if (!authorLine) {
      throw new Error(
          `extraInfo: Author line is not present in the thread item's DOM.`);
    }
    return authorLine;
  }
}
