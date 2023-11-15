import MessageModel from '../../../../models/Message.js';

import StatesExtraInfoService from './states.js';

export default class MessageExtraInfoService {
  static getMessageIdFromNode(messageNode) {
    const id =
        messageNode.querySelector('.scTailwindThreadMessageMessagecardcontent')
            ?.getAttribute?.('data-stats-id');
    if (id === undefined)
      throw new Error(`Couldn't retrieve message id from node.`);
    return id;
  }

  static getMessageFromThreadModel(messageId, threadModel) {
    for (const messageOrGap of threadModel.getMessageOrGapModels()) {
      if (!(messageOrGap instanceof MessageModel)) continue;
      if (messageOrGap.getId() == messageId) {
        return messageOrGap;
      } else {
        for (const subMessageOrGap of messageOrGap.getCommentsAndGaps()) {
          if (!(subMessageOrGap instanceof MessageModel)) continue;
          if (subMessageOrGap.getId() == messageId) {
            return subMessageOrGap;
          }
        }
      }
    }

    throw new Error(`Couldn't find message ${messageId} in thread.`);
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
