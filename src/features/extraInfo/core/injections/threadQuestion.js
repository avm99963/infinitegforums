import {MDCTooltip} from '@material/tooltip';

import ThreadExtraInfoService from '../services/thread.js';

import BaseExtraInfoInjection from './base.js';

export default class ThreadQuestionExtraInfoInjection extends
    BaseExtraInfoInjection {
  inject(threadInfo, injectionDetails) {
    const [chips, tooltips] =
        ThreadExtraInfoService.getThreadChips(threadInfo.thread.data);
    this.#injectChips(chips, injectionDetails.stateChips);
    for (const tooltip of tooltips) new MDCTooltip(tooltip);
  }

  #injectChips(chips, stateChipsElement) {
    const stateChipsContainer = stateChipsElement.querySelector(
        '.scTailwindThreadQuestionStatechipsroot');
    const container = stateChipsContainer ?? stateChipsElement;
    const shouldCreateContainer = stateChipsContainer === null;
    this.addExtraInfoChips(chips, container, shouldCreateContainer);
  }
}
