import '@material/web/button/outlined-button.js';

import {msg, str} from '@lit/localize';
import {css, html} from 'lit';

import {I18nLitElement} from '../../../../common/litI18nUtils.js';
import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';
import {openReplyEditor} from '../../utils/common.js';
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
    this.addEventListener('twpt-click', this.openReplyEditor);
  }

  render() {
    return html`
      <md-outlined-button
          @click=${this.openReplyEditor}>
        ${msg('Reply', {
      desc: 'Button which is used to open the reply box.',
    })}
      </md-outlined-button>
    `;
  }

  #defaultReply(messagePayload) {
    const quoteHeader = document.createElement('div');
    const italics = document.createElement('i');
    const authorName = this.extraInfo?.authorName;
    italics.textContent = msg(str`${authorName} said:`);
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
    openReplyEditor(parentId).then(editor => {
      const payload =
          editor?.querySelector('.scTailwindSharedRichtexteditoreditor');

      payload.prepend(...this.#defaultReply(messagePayload.innerHTML));
      payload.scrollTop = payload.scrollHeight;
    });
  }
}
window.customElements.define(
    'twpt-flatten-thread-reply-button', TwptFlattenThreadReplyButton);
