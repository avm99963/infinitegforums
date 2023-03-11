import '@material/web/button/outlined-button.js';

import {msg} from '@lit/localize';
import {css, html} from 'lit';
import {waitFor} from 'poll-until-promise';

import {I18nLitElement} from '../../../../common/litI18nUtils.js';
import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';
import {getExtraInfoNodes} from '../flattenThreads.js';

export default class TwptFlattenThreadReplyButton extends I18nLitElement {
  static properties = {
    extraInfo: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
    md-outlined-button {
      --md-outlined-button-container-shape: 0.25rem;
      --md-outlined-button-container-height: 38px;
    }
    `,
  ];

  constructor() {
    super();
    this.extraInfo = {};
  }

  render() {
    return html`
      <md-outlined-button
          label="${msg('Reply', {
            desc: 'Button which is used to open the reply box.',
          })}"
          @click=${this.openReplyEditor}>
      </md-outlined-button>
    `;
  }

  #defaultReply(messagePayload) {
    const quoteHeader = document.createElement('div');
    const italics = document.createElement('i');
    italics.textContent = this.extraInfo?.authorName + ' said:';
    quoteHeader.append(italics);

    const quote = document.createElement('blockquote');
    quote.innerHTML = messagePayload;
    getExtraInfoNodes(quote)?.forEach?.(node => {
      node.parentNode.removeChild(node);
    });

    const br1 = document.createElement('br');
    const br2 = document.createElement('br');

    return [quoteHeader, quote, br1, br2];
  }

  openReplyEditor() {
    const messageId = this.extraInfo?.id;
    const messagePayload = document.querySelector(
        '[data-twpt-message-id="' + messageId +
        '"] .scTailwindThreadPostcontentroot html-blob');
    if (!messagePayload) {
      console.error('[flattenThreads] Payload not found.');
      return;
    }

    const parentId = this.extraInfo?.parentId ?? this.extraInfo?.id;
    const parentNodeReply =
        document.querySelector('[data-twpt-message-id="' + parentId + '"]')
            ?.closest?.('sc-tailwind-thread-message-message-card');
    const parentNodeReplyButton = parentNodeReply?.querySelector?.(
        '.scTailwindThreadMessageMessagecardadd-comment button');
    if (!parentNodeReplyButton) {
      // This is not critical: the reply button might already have been clicked
      // (so it no longer exists), or the thread might be locked so replying is
      // disabled and the button does'nt exist.
      console.debug('[flattenThreads] Reply button not found.');
      return;
    }

    // Click the reply button.
    parentNodeReplyButton.click();

    // Fill in the default reply text (it includes a quote of the message the
    // user wishes to reply to).
    waitFor(() => {
      const editor =
          parentNodeReply?.querySelector('sc-tailwind-thread-reply-editor');
      if (editor) return Promise.resolve(editor);
      return Promise.reject(new Error('Editor not found.'));
    }, {interval: 75, timeout: 10 * 1000}).then(editor => {
      const payload =
          editor?.querySelector('.scTailwindSharedRichtexteditoreditor');

      payload.prepend(...this.#defaultReply(messagePayload.innerHTML));
      payload.scrollTop = payload.scrollHeight;
    });
  }
}
window.customElements.define(
    'twpt-flatten-thread-reply-button', TwptFlattenThreadReplyButton);
