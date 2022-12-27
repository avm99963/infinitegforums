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
    const a = this.getCreatedTimestamp();
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

  toRawMessageOrGap() {
    return {1: this.data};
  }

  static mapToMessageOrGapModels(rawArray) {
    return rawArray.map(mog => {
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
