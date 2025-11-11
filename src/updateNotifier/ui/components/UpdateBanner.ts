// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../types/string/index.d.ts" />

import consoleCommonStyles from '../../../static/css/common/console.css?string';
import { property } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { MDCBanner } from '@material/banner';
import { css, html, unsafeCSS } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';

import { I18nLitElement } from '../../../ui/i18n/i18nLitElement';
import { SHARED_MD3_STYLES } from '../../../common/styles/md3.js';

import { TWPT_UPDATE_BANNER_TAG } from '../consts';
import mdcStyles from './mdcStyles.scss?string';

export default class TwptUpdateBanner extends I18nLitElement {
  @property({ type: Boolean })
  accessor isinstall: boolean | undefined;

  private mdcBanner: MDCBanner | undefined;

  static styles = [
    css`
      :host {
        position: sticky;
        top: 0;
        z-index: 97;
      }

      .mdc-banner {
        background-color: var(--TWPT-drawer-background, #fff) !important;
      }

      .mdc-banner__graphic {
        color: var(--mdc-theme-on-primary) !important;
        background-color: var(--mdc-theme-primary) !important;
      }

      .mdc-banner__text {
        color: var(--TWPT-primary-text, #000) !important;
      }
    `,
    css`
      ${unsafeCSS(consoleCommonStyles)}
    `,
    SHARED_MD3_STYLES,
    css`
      ${unsafeCSS(mdcStyles)}
    `,
  ];

  bannerRef = createRef();

  constructor() {
    super();
    this.isinstall = false;
  }

  firstUpdated() {
    if (this.bannerRef.value !== undefined) {
      this.mdcBanner = new MDCBanner(this.bannerRef.value);
      this.mdcBanner.open();
    }
  }

  render() {
    let descriptionMsg: string;
    if (this.isinstall) {
      descriptionMsg = msg(
        'The TW Power Tools extension has been installed. Please reload this page so that it is activated.',
        {
          desc: 'Message shown as a banner when the extension has been installed, to let the user know that they should reload the page.',
        },
      );
    } else {
      descriptionMsg = msg(
        'The TW Power Tools extension has been updated. Please reload this page so that it continues to work properly.',
        {
          desc: 'Message shown as a banner when the extension has been updated, to let the user know that they should reload the page.',
        },
      );
    }
    const reloadMsg = msg('Reload', {
      desc: 'Button which reloads the current page.',
    });
    return html`
      <div
        ${ref(this.bannerRef)}
        class="mdc-banner mdc-banner--centered mdc-banner--mobile-stacked"
        role="banner"
      >
        <div
          class="mdc-banner__content"
          role="alertdialog"
          aria-live="assertive"
        >
          <div class="mdc-banner__graphic-text-wrapper">
            <div class="mdc-banner__graphic" role="img" alt="Update">
              <md-icon class="mdc-banner__icon">update</md-icon>
            </div>
            <div class="mdc-banner__text">${descriptionMsg}</div>
          </div>
          <div class="mdc-banner__actions">
            <md-text-button
              class="mdc-banner__primary-action"
              @click=${this._reloadPage}
            >
              ${reloadMsg}
            </md-text-button>
          </div>
        </div>
      </div>
    `;
  }

  _reloadPage() {
    location.reload();
  }
}

// This element is injected each time an extension is installed/updated, so it
// might already be defined. If it isn't, register it. If there are any breaking
// changes, change TWPT_UPDATE_BANNER_TAG to a higher version.
if (window.customElements.get(TWPT_UPDATE_BANNER_TAG) === undefined) {
  import(
    /* webpackMode: "eager" */
    '@material/web/icon/icon.js'
  );
  import(
    /* webpackMode: "eager" */
    '@material/web/button/text-button.js'
  );

  window.customElements.define(TWPT_UPDATE_BANNER_TAG, TwptUpdateBanner);
}
