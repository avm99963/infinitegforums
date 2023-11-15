import {parseUrl} from '../../../../common/commonUtils.js';
import ThreadModel from '../../../../models/Thread.js';
import {kViewThreadResponse} from '../consts.js';
import MessageExtraInfoService from '../services/message.js';

import ResponseEventBasedInfoHandler from './basedOnResponseEvent.js';

const kIntervalInMs = 500;
const kTimeoutInMs = 10 * 1000;
const kCurrentInfoExpiresInMs = kTimeoutInMs * 1.5;

export default class ThreadInfoHandler extends ResponseEventBasedInfoHandler {
  constructor() {
    super();

    this.thread = undefined;
  }

  getEvent() {
    return kViewThreadResponse;
  }

  getWaitForCurrentInfoOptions() {
    return {
      interval: kIntervalInMs,
      timeout: kTimeoutInMs,
    };
  }

  async isInfoCurrent(injectionDetails) {
    this.thread = new ThreadModel(this.info.body?.[1]);

    const currentPage = this.parseThreadUrl();
    const isCurrentThread =
        Date.now() - this.info.timestamp < kCurrentInfoExpiresInMs &&
        this.thread.getId() == currentPage.thread &&
        this.thread.getForumId() == currentPage.forum;

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
    const message = MessageExtraInfoService.getMessageFromThreadModel(
        messageId, this.thread);
    return message !== undefined;
  }
}
