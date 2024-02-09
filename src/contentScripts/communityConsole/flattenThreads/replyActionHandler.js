import {waitFor} from 'poll-until-promise';

import {parseUrl} from '../../../common/commonUtils';
import {getOptions} from '../../../common/optionsUtils';

const kOpenReplyEditorIntervalInMs = 500;
const kOpenReplyEditorTimeoutInMs = 10 * 1000;

// @TODO: Handle observing when the hash is added after the page has loaded.
export default class FlattenThreadsReplyActionHandler {
  /**
   * @param {Object} options Options object which at least includes the
   *     |flattenthreads| and |flattenthreads_switch_enabled| options.
   */
  constructor(options = null) {
    this.options = options;
  }

  async handleIfApplicable() {
    if (await this.isFeatureEnabled()) this.handle();
  }

  async handle() {
    const hash = window.location.hash;
    if (hash === '#action=reply') await this.openReplyEditor();
  }

  async openReplyEditor() {
    // We erase the hash so the Community Console doesn't open the reply
    // editor, since we're going to do that instead.
    window.location.hash = '';

    const messageId = this.getCurrentMessageId();
    if (messageId === null) {
      console.error(
          '[FlattenThreadsReplyActionHandler] Could not parse current message id.');
      return;
    }

    const replyButton = await waitFor(async () => {
      const replyButton = document.querySelector(
          '[data-twpt-message-id="' + messageId +
          '"] twpt-flatten-thread-reply-button');
      if (replyButton === null) throw new Error('Reply button not found.');
      return replyButton;
    }, {
      interval: kOpenReplyEditorIntervalInMs,
      timeout: kOpenReplyEditorTimeoutInMs,
    });

    const e = new Event('twpt-click');
    replyButton.dispatchEvent(e);
  }

  async isFeatureEnabled() {
    let options;
    if (this.options !== null) {
      options = this.options;
    } else {
      options =
          await getOptions(['flattenthreads', 'flattenthreads_switch_enabled']);
    }
    return options['flattenthreads'] &&
        options['flattenthreads_switch_enabled'];
  }

  getCurrentMessageId() {
    const thread = parseUrl(window.location.href);
    if (thread === false || thread.message === null) {
      return null;
    }
    return thread.message;
  }
}
