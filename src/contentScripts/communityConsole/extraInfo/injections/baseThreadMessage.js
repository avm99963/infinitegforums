import {MDCTooltip} from '@material/tooltip';

import {shouldImplement} from '../../../../common/commonUtils.js';
import ThreadModel from '../../../../models/Thread.js';
import MessageExtraInfoService from '../services/message.js';

import BaseExtraInfoInjection from './base.js';

export default class BaseThreadMessageExtraInfoInjection extends
    BaseExtraInfoInjection {
  /**
   * The class of the interactions root element.
   */
  getInteractionsRootClass() {
    shouldImplement('getInteractionsRootClass');
  }

  /**
   * The class of the interactions root element which signifies that it is
   * non-empty.
   */
  getInteractionsRootNonEmptyClass() {
    shouldImplement('getInteractionsRootNonEmptyClass');
  }

  inject(threadInfo, injectionDetails) {
    const messageNode = injectionDetails.messageNode;
    const message = this.#getMessage(threadInfo, messageNode);
    const [chips, tooltips] = MessageExtraInfoService.getMessageChips(message);
    this.#injectChips(chips, messageNode);
    for (const tooltip of tooltips) new MDCTooltip(tooltip);
  }

  #getMessage(threadInfo, messageNode) {
    const thread = new ThreadModel(threadInfo.body?.[1]);
    const messageId = MessageExtraInfoService.getMessageIdFromNode(messageNode);
    return MessageExtraInfoService.getMessageFromThreadModel(messageId, thread);
  }

  #injectChips(chips, messageNode) {
    const interactionsElement =
        messageNode.querySelector('.' + this.getInteractionsRootClass());
    if (interactionsElement === null)
      throw new Error(`Couldn't find interactions element.`);

    this.#indicateInteractionsElementIsNonEmpty(interactionsElement);

    this.addExtraInfoChips(
        chips, interactionsElement, /* withContainer = */ true);
  }

  #indicateInteractionsElementIsNonEmpty(interactionsElement) {
    interactionsElement.classList.add(this.getInteractionsRootNonEmptyClass());
  }
}
