import {
  ProtobufNumber,
  ProtobufObject,
} from '../common/protojs/protojs.types.js';
import ItemMetadataState from './enums/ItemMetadataState';
import GapModel from './Gap.js';
import ThreadModel from './Thread';
import UserModel from './User.js';

// TODO(https://iavm.xyz/b/twpowertools/231): This class is being used for 2
// messages in different places. Fix this.
/**
 * Model for the `ForumMessage` protobuf message.
 *
 * WARNING: it has methods which correspond to the `MessageView` message.
 */
export default class MessageModel {
  private data: ProtobufObject;
  private thread: ThreadModel;
  private commentsAndGaps: Array<MessageModel | GapModel> | null;

  constructor(data?: ProtobufObject, thread?: ThreadModel) {
    this.data = data ?? {};
    this.thread = thread ?? new ThreadModel();
    this.commentsAndGaps = null;
  }

  getCreatedTimestamp() {
    return (this.data[1]?.[1]?.[2] as ProtobufNumber) ?? null;
  }

  getCreatedMicroseconds() {
    let a = this.getCreatedTimestamp();
    if (a === null) a = '0';
    return BigInt(a);
  }

  getRawCommentsAndGaps(): ProtobufObject[] {
    return this.data[12] ?? [];
  }

  private getMessageOrGapModels(): Array<MessageModel | GapModel> {
    const rawMogs = this.getRawCommentsAndGaps();
    return rawMogs
      .filter((mog) => mog !== undefined)
      .map((mog) => {
        if (mog[1]) return new MessageModel(mog[1], this.thread);
        if (mog[2]) return new GapModel(mog[2], this.thread);
        throw new Error('Expected message or gap.');
      });
  }

  getCommentsAndGaps(): Array<MessageModel | GapModel> {
    if (this.commentsAndGaps === null)
      this.commentsAndGaps = this.getMessageOrGapModels();
    return this.commentsAndGaps;
  }

  clearCommentsAndGaps() {
    this.commentsAndGaps = [];
    this.data[12] = [];
  }

  getPayload() {
    return this.data[1]?.[4] as string ?? null;
  }

  setPayload(value: string | null) {
    if (!this.data[1]) this.data[1] = [];
    this.data[1][4] = value;
  }

  getId() {
    return this.data[1]?.[1]?.[1] as ProtobufNumber ?? null;
  }

  getAuthor(): ProtobufObject | null {
    return this.data[3] ?? null;
  }

  getParentMessageId() {
    return this.data[1]?.[37] as ProtobufNumber ?? null;
  }

  clearParentMessageId() {
    if (!this.data[1]) return;
    delete this.data[1][37];
  }

  isDeleted() {
    return this.data[5]?.[3] as boolean ?? null;
  }

  getState() {
    return this.data[5]?.[1] as number ?? null;
  }

  getEndPendingStateTimestampMicros() {
    return this.data[1]?.[17] as ProtobufNumber ?? null;
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

  toRawMessageOrGap(): ProtobufObject {
    return { 1: this.data };
  }

  mergeCommentOrGapViews(a: MessageModel) {
    this.commentsAndGaps = ThreadModel.mergeMessageOrGaps(
      a.getCommentsAndGaps(),
      this.getCommentsAndGaps(),
    );
    this.data[12] = this.commentsAndGaps.map((cog) => cog.toRawMessageOrGap());
  }

  /**
   * The following method is based on logic written by Googlers in the TW
   * frontend and thus is not included as part of the MIT license.
   *
   * Source:
   * module$exports$google3$customer_support$content$ui$client$tailwind$models$message_model$message_model.MessageModel.prototype.canComment
   */
  canComment(currentUser: UserModel) {
    if (this.isDeleted()) return false;
    if (this.isTakenDown()) return false;
    if (currentUser.isAccountDisabled()) return false;
    if (
      this.thread.isLocked() &&
      !currentUser.isAtLeastCommunityManager(this.thread.getForumId())
    ) {
      return false;
    }
    if (
      this.thread.isSoftLocked() &&
      !currentUser.isAtLeastSilverRole() &&
      !this.thread.isAuthoredByUser()
    ) {
      return false;
    }
    return true;
  }
}
