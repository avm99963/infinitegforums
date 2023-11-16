import StatesExtraInfoService from './states.js';

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

    return [chips, tooltips];
  }
}
