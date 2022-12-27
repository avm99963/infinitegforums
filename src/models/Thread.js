import GapModel from './Gap.js';
import MessageModel from './Message.js';

export default class ThreadModel {
  /**
   * The following code is based on logic written by Googlers in the TW frontend
   * and thus is not included as part of the MIT license.
   */
  static mergeMessageOrGaps(a, b) {
    if (a.length == 0 || b.length == 0)
      return a.length > 0 ? a : b.length > 0 ? b : [];

    let e = [];
    for (let g = 0, k = 0, m = 0, q = a[g], u = b[k];
         g < a.length && k < b.length;) {
      if (q instanceof MessageModel && u instanceof MessageModel) {
        if (q.getCreatedMicroseconds() === u.getCreatedMicroseconds()) {
          u.mergeCommentOrGapViews(q);
        }

        e.push(u);

        if (g === a.length - 1 || k === b.length - 1) {
          for (; ++g < a.length;) e.push(a[g]);
          for (; ++k < b.length;) e.push(b[k]);
          break;
        }

        q = a[++g];
        u = b[++k];
      } else {
        if (u instanceof GapModel) {
          let z;
          for (z = q instanceof MessageModel ? q.getCreatedMicroseconds() :
                                               q.getEndTimestamp();
               z < u.getEndTimestamp();) {
            e.push(q);
            m += q instanceof GapModel ? q.getCount() : 1;
            if (g === a.length - 1) break;
            q = a[++g];
            z = q instanceof MessageModel ? q.getCreatedMicroseconds() :
                                            q.getEndTimestamp();
          }
          if (q instanceof GapModel && u.getCount() - m > 0 &&
              z >= u.getEndTimestamp()) {
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
          let z;
          for (z = u instanceof MessageModel ? u.getCreatedMicroseconds() :
                                               u.getEndTimestamp();
               z < q.getEndTimestamp();) {
            e.push(u);
            m += u instanceof GapModel ? u.getCount() : 1;
            if (k === b.length - 1) break;
            u = b[++k];
            z = u instanceof MessageModel ? u.getCreatedMicroseconds() :
                                            u.getEndTimestamp();
          }
          if (u instanceof GapModel && q.getCount() - m > 0 &&
              z >= q.getEndTimestamp()) {
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

  static mergeMessageOrGapsMultiarray(mogsModels) {
    if (mogsModels.length < 1) return [];
    let mergeResult = mogsModels[0];
    for (let i = 1; i < mogsModels.length; ++i) {
      mergeResult = ThreadModel.mergeMessageOrGaps(mergeResult, mogsModels[i]);
    }
    return mergeResult;
  }
}
