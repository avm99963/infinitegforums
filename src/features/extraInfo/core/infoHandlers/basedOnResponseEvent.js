import {waitFor} from 'poll-until-promise';

import {shouldImplement} from '../../../../common/commonUtils.js';

import BaseInfoHandler from './base.js';

export default class ResponseEventBasedInfoHandler extends BaseInfoHandler {
  constructor() {
    super();

    if (this.constructor == ResponseEventBasedInfoHandler) {
      throw new Error('The base class cannot be instantiated.');
    }

    this.setUpDefaultInfoValue();
    this.setUpEventHandler();
  }

  /**
   * Should return the name of the XHR interceptor event for the API response
   * which has the information being handled.
   */
  getEvent() {
    shouldImplement('getEvent');
  }

  /**
   * This function should return a promise which resolves to a boolean
   * specifying whether this.info is the information related to the view that
   * the user is currently on.
   */
  async isInfoCurrent(_injectionDetails) {
    shouldImplement('isInfoCurrent');
  }

  /**
   * Should return the options for the waitFor function which is called when
   * checking whether the information is current or not.
   */
  getWaitForCurrentInfoOptions() {
    shouldImplement('getWaitForCurrentInfoOptions');
  }

  setUpDefaultInfoValue() {
    this.info = {
      body: {},
      id: -1,
      timestamp: 0,
    };
  }

  setUpEventHandler() {
    window.addEventListener(this.getEvent(), e => {
      if (e.detail.id < this.info.id) return;

      this.updateInfoWithNewValue(e);
    });
  }

  /**
   * Updates the info value with the information obtained from an event.
   * Can be overriden to implement more advanced logic.
   *
   * @param {Event} e
   */
  updateInfoWithNewValue(e) {
    this.info = {
      body: e.detail.body,
      id: e.detail.id,
      timestamp: Date.now(),
    };
  }

  async getCurrentInfo(injectionDetails) {
    const options = this.getWaitForCurrentInfoOptions();
    return waitFor(
        () => this.attemptToGetCurrentInfo(injectionDetails), options);
  }

  async attemptToGetCurrentInfo(injectionDetails) {
    const isInfoCurrent = await this.isInfoCurrent(injectionDetails);
    if (!isInfoCurrent) throw new Error('Didn\'t receive current information');

    return this.info;
  }
}
