import {shouldImplement} from '../../../../common/commonUtils.js';

export default class BaseInfoHandler {
  constructor() {
    if (this.constructor == BaseInfoHandler) {
      throw new Error('The base class cannot be instantiated.');
    }
  }

  /**
   * Should return a promise which resolves to the current info in a best-effort
   * manner (if it can't retrieve the current info it is allowed to fail).
   */
  async getCurrentInfo(_injectionDetails) {
    shouldImplement('getCurrentInfo');
  }
}
