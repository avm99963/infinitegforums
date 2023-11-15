import ItemMetadataState from './enums/ItemMetadataState.js';
import GapModel from './Gap.js';
import ThreadModel from './Thread.js';

export default class MessageModel {
  constructor(data, thread) {
    this.data = data ?? {};
    this.thread = thread ?? new ThreadModel();
    this.commentsAndGaps = null;
  }

  getCreatedTimestamp() {
    return this.data[1]?.[1]?.[2] ?? null;
  }

  getCreatedMicroseconds() {
    let a = this.getCreatedTimestamp();
    if (a === null) a = '0';
    return BigInt(a);
  }

  getRawCommentsAndGaps() {
    return this.data[12] ?? [];
  }

  #getMessageOrGapModels() {
    const rawMogs = this.getRawCommentsAndGaps();
    return rawMogs.filter(mog => mog !== undefined).map(mog => {
      if (mog[1]) return new MessageModel(mog[1], this.thread);
      if (mog[2]) return new GapModel(mog[2], this.thread);
    });
  }

  getCommentsAndGaps() {
    if (this.commentsAndGaps === null)
      this.commentsAndGaps = this.#getMessageOrGapModels();
    return this.commentsAndGaps;
  }

  clearCommentsAndGaps() {
    this.commentsAndGaps = [];
    this.data[12] = [];
  }

  getPayload() {
    return this.data[1]?.[4] ?? null;
  }

  setPayload(value) {
    if (!this.data[1]) this.data[1] = [];
    this.data[1][4] = value;
  }

  getId() {
    return this.data[1]?.[1]?.[1] ?? null;
  }

  getAuthor() {
    return this.data[3] ?? null;
  }

  getParentMessageId() {
    return this.data[1]?.[37] ?? null;
  }

  clearParentMessageId() {
    if (!this.data[1]) return;
    delete this.data[1][37];
  }

  isDeleted() {
    return this.data[5]?.[3] ?? null;
  }

  getState() {
    return this.data[5]?.[1] ?? null;
  }

  getEndPendingStateTimestampMicros() {
    return this.data[1]?.[17] ?? null;
  }

  isTakenDown() {
    return [
      ItemMetadataState.AUTOMATED_ABUSE_TAKE_DOWN_DELETE,
      ItemMetadataState.MANUAL_PROFILE_TAKE_DOWN_SUSPEND,
      ItemMetadataState.AUTOMATED_ABUSE_TAKE_DOWN_HIDE,
      ItemMetadataState.MANUAL_TAKE_DOWN_DELETE,
      ItemMetadataState.MANUAL_TAKE_DOWN_HIDE,
    ].includes(this.getState());
  }

  isComment() {
    return !!this.getParentMessageId;
  }

  toRawMessageOrGap() {
    return {1: this.data};
  }

  mergeCommentOrGapViews(a) {
    this.commentsAndGaps = ThreadModel.mergeMessageOrGaps(
        a.getCommentsAndGaps(), this.getCommentsAndGaps());
    this.data[12] = this.commentsAndGaps.map(cog => cog.toRawMessageOrGap());
  }

  /**
   * The following method is based on logic written by Googlers in the TW
   * frontend and thus is not included as part of the MIT license.
   *
   * Source:
   * module$exports$google3$customer_support$content$ui$client$tailwind$models$message_model$message_model.MessageModel.prototype.canComment
   */
  canComment(currentUser) {
    if (this.isDeleted()) return false;
    if (this.isTakenDown()) return false;
    if (currentUser.isAccountDisabled()) return false;
    if (this.thread.isLocked() &&
        !currentUser.isAtLeastCommunityManager(this.thread.getForumId())) {
      return false;
    }
    if (this.thread.isSoftLocked() && !currentUser.isAtLeastSilverRole() &&
        !this.thread.isAuthoredByUser()) {
      return false;
    }
    return true;
  }
}
