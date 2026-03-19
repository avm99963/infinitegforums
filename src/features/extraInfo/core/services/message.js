import MessageModel from '@/models/Message.js';
import StatesExtraInfoService from './states.js';
import { createPlainTooltip } from '@/common/tooltip.js';

export default class MessageExtraInfoService {
  static getMessageIdFromNode(messageNode) {
    const isMainReply =
        messageNode.tagName == 'SC-TAILWIND-THREAD-MESSAGE-MESSAGE-CARD';
    const cardContentClass = isMainReply ?
        '.scTailwindThreadMessageMessagecardcontent' :
        '.scTailwindThreadMessageCommentcardnested-reply';
    const id = messageNode.querySelector(cardContentClass)
                   ?.getAttribute?.('data-stats-id');
    if (id === undefined)
      throw new Error(`Couldn't retrieve message id from node.`);
    return id;
  }

  static getMessageFromList(messageId, messagesList) {
    for (const message of messagesList) {
      if (message.getId() == messageId) return message;
    }
    throw new Error(`Couldn't find message ${messageId} in the message list.`);
  }

  /**
   * @param {MessageModel} messageModel
   */
  static getMessageChips(messageModel) {
    const chips = [];
    const tooltips = [];

    const endPendingStateTimestampMicros =
        messageModel.getEndPendingStateTimestampMicros();
    const [pendingStateChip, pendingStateTooltip] =
        StatesExtraInfoService.getPendingStateChip(
            endPendingStateTimestampMicros);
    if (pendingStateChip) chips.push(pendingStateChip);
    if (pendingStateTooltip) tooltips.push(pendingStateTooltip);

    const itemMetadata = messageModel.data?.[1]?.[5];
    chips.push(...StatesExtraInfoService.getMetadataChips(itemMetadata));

    const liveReviewStatus = messageModel.data?.[1]?.[36];
    const [liveReviewChip, liveReviewTooltip] =
        StatesExtraInfoService.getLiveReviewStatusChip(liveReviewStatus);
    if (liveReviewChip) chips.push(liveReviewChip);
    if (liveReviewTooltip) tooltips.push(liveReviewTooltip);

    const postedWithWorkflowChip = this.#getPostedWithWorkflowChip(messageModel);
    if (postedWithWorkflowChip) {
      chips.push(postedWithWorkflowChip.chip);
      tooltips.push(postedWithWorkflowChip.tooltip);
    }

    return [chips, tooltips];
  }

  /**
   * @param {MessageModel} messageModel
   */
  static #getPostedWithWorkflowChip(messageModel) {
    if (!messageModel.isPostedWithWorkflow()) {
      return null;
    }

    const span = document.createElement('span');
    span.textContent =
        chrome.i18n.getMessage(
            'inject_extrainfo_message_posted_with_workflow');

    const tooltip = createPlainTooltip(
        span,
        chrome.i18n.getMessage(
            'inject_extrainfo_message_posted_with_workflow_tooltip'),
        false);

    return {
      chip: span,
      tooltip,
    };
  }
}
