import {
  ProtobufNumber,
  ProtobufObject,
} from '../common/protojs/protojs.types.js';
import GapModel from './Gap.js';
import MessageModel from './Message';

// Keys of the PromotedMessages protobuf message which contain lists of promoted
// messages.
const kPromotedMessagesKeys = [1, 2, 3, 4, 5, 6];

/**
 * Model for the `ThreadView` protobuf message.
 */
export default class ThreadModel {
  private data: ProtobufObject;

  constructor(data?: ProtobufObject) {
    this.data = data ?? {};
  }

  getId() {
    return (this.data[2]?.[1]?.[1] as ProtobufNumber) ?? null;
  }

  getForumId() {
    return (this.data[2]?.[1]?.[3] as ProtobufNumber) ?? null;
  }

  getRawCommentsAndGaps(): ProtobufObject[] {
    return (this.data[40] as ProtobufObject[]) ?? [];
  }

  setRawCommentsAndGaps(cogs: ProtobufObject[] | null) {
    this.data[40] = cogs;
  }

  getMessageOrGapModels() {
    const rawMogs = this.getRawCommentsAndGaps();
    return rawMogs
      .filter((mog) => mog !== undefined)
      .map((mog) => {
        if (mog[1]) return new MessageModel(mog[1], this);
        if (mog[2]) return new GapModel(mog[2], this);
        throw new Error('Expected message or gap.');
      });
  }

  setLastMessage(message: ProtobufObject | null) {
    if (!this.data[17]) this.data[17] = [];
    this.data[17][3] = message;
  }

  setNumMessages(num: ProtobufNumber | null) {
    this.data[8] = num;
  }

  isLocked() {
    // TODO: When a forum is read-only, this should also return true.
    return this.data[2]?.[5] == true;
  }

  isSoftLocked() {
    return this.data[2]?.[51] == true;
  }

  isAuthoredByUser() {
    return this.data[9] == true;
  }

  toRawThread(): ProtobufObject {
    return this.data;
  }

  getPromotedMessagesList(): MessageModel[] {
    const promotedMessages: MessageModel[] = [];
    for (const key of kPromotedMessagesKeys) {
      const messagesList = this.data[17][key] ?? [];
      for (const rawMessage of messagesList) {
        const message = new MessageModel(rawMessage);
        if (message.getId() === null) continue;

        const isMessageAlreadyIncluded = promotedMessages.some(
          (existingMessage) => existingMessage.getId() == message.getId(),
        );
        if (isMessageAlreadyIncluded) continue;

        promotedMessages.push(message);
      }
    }
    return promotedMessages;
  }

  /**
   * Get a list with all the messages contained in the model.
   */
  getAllMessagesList(): MessageModel[] {
    const messages: MessageModel[] = [];

    for (const messageOrGap of this.getMessageOrGapModels()) {
      if (!(messageOrGap instanceof MessageModel)) continue;
      messages.push(messageOrGap);
      for (const subMessageOrGap of messageOrGap.getCommentsAndGaps()) {
        if (!(subMessageOrGap instanceof MessageModel)) continue;
        messages.push(subMessageOrGap);
      }
    }

    const promotedMessages = this.getPromotedMessagesList();
    for (const message of promotedMessages) {
      const isMessageAlreadyIncluded = messages.some(
        (existingMessage) => existingMessage.getId() == message.getId(),
      );
      if (isMessageAlreadyIncluded) continue;

      messages.push(message);
    }

    return messages;
  }

  /**
   * The following code is based on logic written by Googlers in the TW frontend
   * and thus is not included as part of the MIT license.
   */
  static mergeMessageOrGaps(
    a: Array<MessageModel | GapModel>,
    b: Array<MessageModel | GapModel>,
  ): Array<MessageModel | GapModel> {
    if (a.length == 0 || b.length == 0)
      return a.length > 0 ? a : b.length > 0 ? b : [];

    let e: Array<MessageModel | GapModel> = [];
    for (
      let g = 0, k = 0, m = 0, q = a[g], u = b[k];
      g < a.length && k < b.length;

    ) {
      if (q instanceof MessageModel && u instanceof MessageModel) {
        if (q.getCreatedMicroseconds() === u.getCreatedMicroseconds()) {
          u.mergeCommentOrGapViews(q);
        }

        e.push(u);

        if (g === a.length - 1 || k === b.length - 1) {
          for (; ++g < a.length; ) e.push(a[g]);
          for (; ++k < b.length; ) e.push(b[k]);
          break;
        }

        q = a[++g];
        u = b[++k];
      } else {
        if (u instanceof GapModel) {
          let z: bigint;
          for (
            z =
              q instanceof MessageModel
                ? q.getCreatedMicroseconds()
                : q.getEndTimestamp();
            z < u.getEndTimestamp();

          ) {
            e.push(q);
            m += q instanceof GapModel ? q.getCount() : 1;
            if (g === a.length - 1) break;
            q = a[++g];
            z =
              q instanceof MessageModel
                ? q.getCreatedMicroseconds()
                : q.getEndTimestamp();
          }
          if (
            q instanceof GapModel &&
            u.getCount() - m > 0 &&
            z >= u.getEndTimestamp()
          ) {
            const gm = new GapModel();
            gm.setCount(u.getCount() - m);
            gm.setStartMicroseconds('' + q.getStartTimestamp());
            gm.setEndMicroseconds('' + u.getEndTimestamp());
            gm.setParentId(u.getParentId());
            e.push(gm);
            m = u.getCount() - m;
          } else {
            m = 0;
          }
          if (k === b.length - 1) break;
          u = b[++k];
        }
        if (q instanceof GapModel) {
          let z: bigint;
          for (
            z =
              u instanceof MessageModel
                ? u.getCreatedMicroseconds()
                : u.getEndTimestamp();
            z < q.getEndTimestamp();

          ) {
            e.push(u);
            m += u instanceof GapModel ? u.getCount() : 1;
            if (k === b.length - 1) break;
            u = b[++k];
            z =
              u instanceof MessageModel
                ? u.getCreatedMicroseconds()
                : u.getEndTimestamp();
          }
          if (
            u instanceof GapModel &&
            q.getCount() - m > 0 &&
            z >= q.getEndTimestamp()
          ) {
            const gm = new GapModel();
            gm.setCount(q.getCount() - m);
            gm.setStartMicroseconds('' + u.getStartTimestamp());
            gm.setEndMicroseconds('' + q.getEndTimestamp());
            gm.setParentId(q.getParentId());
            e.push(gm);
            m = q.getCount() - m;
          } else {
            m = 0;
          }
          if (g === a.length - 1) break;
          q = a[++g];
        }
      }
    }
    return e;
  }

  static mergeMessageOrGapsMultiarray(
    mogsModels: Array<Array<MessageModel | GapModel>>,
  ) {
    if (mogsModels.length < 1) return [];
    let mergeResult = mogsModels[0];
    for (let i = 1; i < mogsModels.length; ++i) {
      mergeResult = ThreadModel.mergeMessageOrGaps(mergeResult, mogsModels[i]);
    }
    return mergeResult;
  }
}
