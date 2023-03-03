import '@material/web/icon/icon.js';
import '@material/web/iconbutton/standard-icon-button.js';

import {css, html, LitElement} from 'lit';

import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';

export default class TwptFlattenThreadQuoteAuthor extends LitElement {
  static properties = {
    prevMessage: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
    :host {
      display: flex;
      flex-direction: row;
      align-items: center;
      max-width: max(25%, 150px);
      color: var(--TWPT-interop-secondary-text, #444746);
    }

    :host > *:not(:last-child) {
      margin-right: 4px;
    }

    .reply-icon {
      font-size: 20px;
    }

    .name {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 15px;
    }
    `,
  ];

  constructor() {
    super();
    this.prevMessage = {};
  }

  render() {
    return html`
      <md-icon class="reply-icon">reply</md-icon>
      <span class="name">${this.prevMessage?.author?.[1]?.[1]}</span>
      <md-standard-icon-button
          icon="arrow_upward"
          @click=${this.focusParent}>
      </md-standard-icon-button>
    `;
  }

  focusParent() {
    const parentNode = document.querySelector(
        '[data-twpt-message-id="' + this.prevMessage?.id + '"]');
    parentNode.focus({preventScroll: true});
    parentNode.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
window.customElements.define(
    'twpt-flatten-thread-quote-author', TwptFlattenThreadQuoteAuthor);
