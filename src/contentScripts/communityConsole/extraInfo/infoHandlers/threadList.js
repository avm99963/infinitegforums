import {waitFor} from 'poll-until-promise';

import {kViewForumRequest, kViewForumResponse} from '../consts.js';
import ThreadExtraInfoService from '../services/thread.js';

import BaseInfoHandler from './base.js';

const kCheckIntervalInMs = 450;
const kTimeoutInMs = 2 * 1000;

export default class ThreadListInfoHandler extends BaseInfoHandler {
  constructor() {
    super();

    this.setUpDefaultValues();
    this.setUpEventHandlers();
  }

  setUpDefaultValues() {
    this.threads = [];
    this.isFirstBatch = null;
    this.requestId = -1;
    this.timestamp = 0;
  }

  setUpEventHandlers() {
    window.addEventListener(kViewForumRequest, e => this.onThreadRequest(e));
    window.addEventListener(kViewForumResponse, e => this.onThreadResponse(e));
  }

  onThreadRequest(e) {
    // Ignore ViewForum requests made by the chat feature and the "Mark as
    // duplicate" dialog.
    //
    // All those requests have |maxNum| set to 10 and 20 respectively, while
    // the requests that we want to handle are the ones to initially load the
    // thread list (which currently requests 100 threads) and the ones to load
    // more threads (which request 50 threads).
    const maxNum = e.detail.body?.['2']?.['1']?.['2'];
    if (maxNum == 10 || maxNum == 20) return;

    this.requestId = e.detail.id;
    this.isFirstBatch =
        !e.detail.body?.['2']?.['1']?.['3']?.['2'];  // Pagination token
  }

  onThreadResponse(e) {
    if (e.detail.id != this.requestId) return;

    const threads = e.detail.body?.['1']?.['2'] ?? [];
    if (this.isFirstBatch)
      this.threads = threads;
    else
      this.threads = this.threads.concat(threads);

    this.timestamp = Date.now();
  }

  async getCurrentInfo(injectionDetails) {
    const currentThreadInfo = injectionDetails.threadInfo;
    const checkRecentTimestamp = !injectionDetails.isExpanded;

    return this.getCurrentThreads(currentThreadInfo, checkRecentTimestamp)
        .catch(err => {
          if (checkRecentTimestamp) {
            return this.getCurrentThreads(
                currentThreadInfo, /* checkRecentTimestamp = */ false);
          } else {
            throw err;
          }
        });
  }

  async getCurrentThreads(currentThreadInfo, checkRecentTimestamp) {
    const options = {
      interval: kCheckIntervalInMs,
      timeout: kTimeoutInMs,
    };
    return waitFor(
        () => this.attemptToGetCurrentThreads(
            currentThreadInfo, checkRecentTimestamp),
        options);
  }

  async attemptToGetCurrentThreads(currentThreadInfo, checkRecentTimestamp) {
    if (!this.isThreadListCurrent(currentThreadInfo, checkRecentTimestamp))
      throw new Error('Didn\'t receive current information');

    return this.threads;
  }

  isThreadListCurrent(currentThreadInfo, checkRecentTimestamp) {
    if (checkRecentTimestamp && Date.now() - this.timestamp > kTimeoutInMs)
      return false;

    const thread = ThreadExtraInfoService.getThreadFromThreadList(
        this.threads, currentThreadInfo);
    return thread !== undefined;
  }
}
