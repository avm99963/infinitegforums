import '@material/web/button/tonal-button.js';

import './QuoteAuthor.js';

// Other components imported so they are also injected:
import './ReplyButton.js';

import {msg} from '@lit/localize';
import * as DOMPurify from 'dompurify';
import {css, html} from 'lit';
import {classMap} from 'lit/directives/class-map.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import {I18nLitElement} from '../../../../common/litI18nUtils.js';
import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';

export default class TwptFlattenThreadQuote extends I18nLitElement {
  static properties = {
    prevMessage: {type: Object},
    _expanded: {type: Boolean},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
    :host {
      display: block;
    }

    .quote-container {
      position: relative;
      background-color: var(--TWPT-secondary-background, rgba(242, 242, 242, 0.502));
      margin-bottom: 16px;
      padding: 0 12px 12px 12px;
      border-radius: 12px;
    }

    .payload-container {
      padding-top: 12px;
    }

    .quote-container:not(.quote-container--expanded) .payload-container {
      max-height: 2.8rem;
      overflow: hidden;
      mask-image: linear-gradient(rgb(0, 0, 0) 76%, transparent);
      -webkit-mask-image: linear-gradient(rgb(0, 0, 0) 76%, transparent);
    }

    .payload-container twpt-flatten-thread-quote-author {
      float: right;
      margin-left: 12px;
      margin-top: -12px;
      shape-outside: inset(0 10px 10px 0);
    }

    .payload {
      display: inline;
    }

    .payload img {
      max-width: 100%;
      max-height: calc(100vh - 2*64px);
    }

    .payload blockquote {
      border-left: 1px solid #757575;
      margin: 0 0 0 4px;
      padding: 0 0 0 4px;
    }

    .buttons-row {
      position: absolute;
      width: calc(100% - 24px);
      display: flex;
      flex-direction: row;
      justify-content: center;
      bottom: -20px;
      transition: opacity .25s;
    }

    @media (hover: hover) {
      @supports selector(:has(div)) {
        .quote-container:not(:hover) .buttons-row:not(:focus-within) {
          opacity: 0;
        }
      }
    }

    .buttons-row md-tonal-button {
      --md-tonal-button-container-color: var(--TWPT-dark-flatten-replies-more-bg, rgba(222, 222, 222, 0.9));
      --md-tonal-button-label-text-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-hover-label-text-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-focus-label-text-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-pressed-label-text-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-with-icon-icon-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-with-icon-hover-icon-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-with-icon-focus-icon-color: var(--TWPT-md-sys-color-on-surface);
      --md-tonal-button-with-icon-pressed-icon-color: var(--TWPT-md-sys-color-on-surface);
    }
    `,
  ];

  constructor() {
    super();
    this.prevMessage = {};
    this._expanded = false;
  }

  getTrustedPayload() {
    return DOMPurify.sanitize(this.prevMessage?.payload ?? '');
  }

  render() {
    const containerClasses = classMap({
      'quote-container': true,
      'quote-container--expanded': this._expanded,
    });
    const lessMsg = msg('Less', {
      desc: 'Button to collapse the quote message (used in the flatten threads feature).',
    });
    const moreMsg = msg('More', {
      desc: 'Button to expand the quote message (used in the flatten threads feature).',
    });
    return html`
      <div class=${containerClasses}>
        <div class="payload-container">
          <twpt-flatten-thread-quote-author
              .prevMessage=${this.prevMessage}>
          </twpt-flatten-thread-quote-author>
          <div class="payload">
            ${unsafeHTML(this.getTrustedPayload())}
          </div>
        </div>
        <div class="buttons-row">
          <md-tonal-button
              icon="${this._expanded ? 'expand_less' : 'expand_more'}"
              label="${this._expanded ? lessMsg : moreMsg}"
              @click=${this.toggleExpanded}>
          </md-tonal-button>
        </div>
      </div>
    `;
  }

  toggleExpanded() {
    this._expanded = !this._expanded;
  }
}
window.customElements.define(
    'twpt-flatten-thread-quote', TwptFlattenThreadQuote);
