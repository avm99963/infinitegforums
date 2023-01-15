import GapModel from './Gap.js';
import ThreadModel from './Thread.js';

export default class MessageModel {
  constructor(data) {
    this.data = data ?? {};
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

  getCommentsAndGaps() {
    if (this.commentsAndGaps === null)
      this.commentsAndGaps =
          MessageModel.mapToMessageOrGapModels(this.getRawCommentsAndGaps());
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

  isComment() {
    return !!this.getParentMessageId;
  }

  toRawMessageOrGap() {
    return {1: this.data};
  }

  static mapToMessageOrGapModels(rawArray) {
    return rawArray.filter(mog => mog !== undefined).map(mog => {
      if (mog[1]) return new MessageModel(mog[1]);
      if (mog[2]) return new GapModel(mog[2]);
    });
  }

  mergeCommentOrGapViews(a) {
    this.commentsAndGaps = ThreadModel.mergeMessageOrGaps(
        a.getCommentsAndGaps(), this.getCommentsAndGaps());
    this.data[12] = this.commentsAndGaps.map(cog => cog.toRawMessageOrGap());
  }
}
