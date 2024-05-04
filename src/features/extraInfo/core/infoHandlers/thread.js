import {waitFor} from 'poll-until-promise';

import {parseUrl} from '../../../../common/commonUtils.js';
import ThreadModel from '../../../../models/Thread.js';
import {kViewThreadResponse} from '../consts.js';
import MessageExtraInfoService from '../services/message.js';

import ResponseEventBasedInfoHandler from './basedOnResponseEvent.js';

const kIntervalInMs = 500;
const kTimeoutInMs = 3 * 1000;
const kCurrentInfoExpiresInMs = kTimeoutInMs * 1.5;

export default class ThreadInfoHandler extends ResponseEventBasedInfoHandler {
  getEvent() {
    return kViewThreadResponse;
  }

  getWaitForCurrentInfoOptions() {
    return {
      interval: kIntervalInMs,
      timeout: kTimeoutInMs,
    };
  }

  setUpDefaultInfoValue() {
    this.info = {
      thread: new ThreadModel(),
      messages: [],
      id: -1,
      timestamp: 0,
    };
  }

  updateInfoWithNewValue(e) {
    const newThread = new ThreadModel(e.detail.body?.[1]);
    if (newThread.getId() != this.info.thread.getId()) {
      this.info.messages = [];
    }

    const newMessages = newThread.getAllMessagesList();
    this.updateRecordedMessages(newMessages);

    this.info.thread = newThread;
    this.info.id = e.detail.id;
    this.info.timestamp = Date.now();
  }

  updateRecordedMessages(newMessages) {
    const nonUpdatedMessages = this.info.messages.filter(message => {
      return !newMessages.some(newMessage => {
        return message.getId() == newMessage.getId();
      });
    });
    this.info.messages = nonUpdatedMessages.concat(newMessages);
  }

  async getCurrentInfo(injectionDetails) {
    return this
        .getCurrentThreads(injectionDetails, /* checkRecentTimestamp = */ true)
        .catch(() => {
          console.debug(
              `extraInfo: couldn't get updated thread info. Trying to ` +
              `get the information even if it is old.`);
          return this.getCurrentThreads(
              injectionDetails, /* checkRecentTimestamp = */ false);
        });
  }

  async getCurrentThreads(injectionDetails, checkRecentTimestamp) {
    injectionDetails.checkRecentTimestamp = checkRecentTimestamp;
    const options = this.getWaitForCurrentInfoOptions();
    return waitFor(
        () => this.attemptToGetCurrentInfo(injectionDetails), options);
  }

  async isInfoCurrent(injectionDetails) {
    const checkRecentTimestamp = injectionDetails.checkRecentTimestamp;
    const isMessageNode = injectionDetails.isMessageNode;
    const messageNode = injectionDetails.messageNode;

    return (!checkRecentTimestamp || this.isThreadCurrent()) &&
        (!isMessageNode || this.currentThreadContainsMessage(messageNode));
  }

  isThreadCurrent() {
    const currentPage = this.parseThreadUrl();
    return Date.now() - this.info.timestamp < kCurrentInfoExpiresInMs &&
        this.info.thread.getId() == currentPage.thread &&
        this.info.thread.getForumId() == currentPage.forum;
  }

  parseThreadUrl() {
    const currentPage = parseUrl(location.href);
    if (currentPage === false)
      throw new Error(`couldn't parse current URL: ${location.href}`);

    return currentPage;
  }

  currentThreadContainsMessage(messageNode) {
    const messageId = MessageExtraInfoService.getMessageIdFromNode(messageNode);
    const message = MessageExtraInfoService.getMessageFromList(
        messageId, this.info.messages);
    return message !== undefined;
  }
}
