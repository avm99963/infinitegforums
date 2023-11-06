import {MDCTooltip} from '@material/tooltip';

import {parseUrl} from '../../../../common/commonUtils.js';
import ThreadExtraInfoService from '../services/thread.js';

import BaseExtraInfoInjection from './base.js';

export default class ExpandedThreadListExtraInfoInjection extends
    BaseExtraInfoInjection {
  getInjectionDetails(toolbelt) {
    const headerContent =
        toolbelt?.parentNode?.parentNode?.parentNode?.querySelector?.(
            '.main-header .header a.header-content');
    if (headerContent === null) {
      throw new Error(
          `extraInfo: Header is not present in the thread item's DOM.`);
    }

    const threadInfo = parseUrl(headerContent.href);
    if (threadInfo === false)
      throw new Error(`extraInfo: Thread's link cannot be parsed.`);

    return {
      toolbelt,
      threadInfo,
      isExpanded: true,
    };
  }

  inject(threads, injectionDetails) {
    const thread = ThreadExtraInfoService.getThreadFromThreadList(
        threads, injectionDetails.threadInfo);
    const [chipContentList, tooltips] =
        ThreadExtraInfoService.getThreadChips(thread);
    this.addExtraInfoChips(
        chipContentList, injectionDetails.toolbelt, /* withContainer = */ true);
    for (const tooltip of tooltips) new MDCTooltip(tooltip);
  }
}
