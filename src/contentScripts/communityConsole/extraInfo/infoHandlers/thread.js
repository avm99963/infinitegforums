import {parseUrl} from '../../../../common/commonUtils.js';
import ThreadModel from '../../../../models/Thread.js';
import {kViewThreadResponse} from '../consts.js';
import MessageExtraInfoService from '../services/message.js';

import ResponseEventBasedInfoHandler from './basedOnResponseEvent.js';

const kIntervalInMs = 500;
const kTimeoutInMs = 10 * 1000;
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

  async isInfoCurrent(injectionDetails) {
    const currentPage = this.parseThreadUrl();
    const isCurrentThread =
        Date.now() - this.info.timestamp < kCurrentInfoExpiresInMs &&
        this.info.thread.getId() == currentPage.thread &&
        this.info.thread.getForumId() == currentPage.forum;

    const isMessageNode = injectionDetails.isMessageNode;
    const messageNode = injectionDetails.messageNode;

    return isCurrentThread &&
        (!isMessageNode || this.currentThreadContainsMessage(messageNode));
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
