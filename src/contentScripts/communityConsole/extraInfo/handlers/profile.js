import {kViewUnifiedUserResponseEvent} from '../consts.js';

import ResponseEventBasedInfoHandler from './basedOnResponseEvent.js';

export default class ProfileInfoHandler extends ResponseEventBasedInfoHandler {
  getEvent() {
    return kViewUnifiedUserResponseEvent;
  }

  async isInfoCurrent() {
    return Date.now() - this.info.timestamp < 15 * 1000;
  }

  getWaitForCurrentInfoOptions() {
    return {
      interval: 500,
      timeout: 15 * 1000,
    };
  }
}
