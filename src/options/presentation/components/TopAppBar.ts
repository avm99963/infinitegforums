/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * Heavily modified for use in the TW Power Tools project.
 * Based on https://github.com/material-components/material-web/blob/9f85b3e0c083a9a6c666d158747c96037ee36602/catalog/src/components/top-app-bar.ts.
 */

import type { MdIconButton } from '@material/web/iconbutton/icon-button.js';
import { css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';
import { SKIP_TO_MAIN_EVENT } from './consts';
import {
  EXTENSION_NAME,
  I18nLitElement,
  SKIP_TO_MAIN_CONTENT,
} from '../../../common/litI18nUtils.js';
import { msg } from '@lit/localize';

import '@material/web/focus/md-focus-ring.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

/**
 * Top app bar.
 */
@customElement('top-app-bar')
export class TopAppBar extends I18nLitElement {
  /**
   * Whether the drawer is open.
   */
  @property({ type: Boolean })
  accessor isDrawerOpen = false;

  /**
   * Whether we should show the link to the experiments page.
   */
  @property({ type: Boolean })
  accessor showExperimentsLink: boolean;

  render() {
    const openCategoriesMenuLabel = msg('Open menu with feature categories', {
      desc: 'Label for the button that opens the list of feature categories in the options page.',
    });
    const closeCategoriesMenuLabel = msg('Close menu with feature categories', {
      desc: 'Label for the button that closes the list of feature categories in the options page.',
    });
    const experimentsLinkLabel = msg('Experiments', {
      desc: 'Label for the link to the experiments page.',
    });
    const localizationLinkLabel = msg('Help translate the extension', {
      desc: 'Label for the link to Weblate.',
    });

    return html`
      <header>
        <div class="default-content">
          <section class="start">
            <md-icon-button
              toggle
              class="menu-button"
              aria-label-selected=${openCategoriesMenuLabel}
              aria-label=${closeCategoriesMenuLabel}
              aria-expanded=${this.isDrawerOpen ? 'false' : 'true'}
              title="${!this.isDrawerOpen
                ? openCategoriesMenuLabel
                : closeCategoriesMenuLabel}"
              .selected=${live(!this.isDrawerOpen)}
              @input=${this.onMenuIconToggle}
            >
              <md-icon slot="selected">menu</md-icon>
              <md-icon>menu_open</md-icon>
            </md-icon-button>
            <md-icon class="home-button" aria-hidden="true">
              <img src="/icons/512.png" />
            </md-icon>
          </section>

          <span class="title">${EXTENSION_NAME()}</span>

          <button
            id="skip-to-main"
            class="md-typescale-title-large"
            tabindex="0"
            @click=${this.skipToMain}
          >
            ${SKIP_TO_MAIN_CONTENT()}
          </button>

          <section class="end">
            ${this.showExperimentsLink
              ? html`
                  <md-icon-button
                    title=${experimentsLinkLabel}
                    aria-label=${experimentsLinkLabel}
                    href="/options/experiments.html"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <md-icon>experiment</md-icon>
                  </md-icon-button>
                `
              : nothing}
            <md-icon-button
              title=${localizationLinkLabel}
              aria-label=${localizationLinkLabel}
              href="https://i18n.avm99963.com/projects/tw-power-tools/#languages"
              target="_blank"
              rel="noreferrer noopener"
            >
              <md-icon>translate</md-icon>
            </md-icon-button>
          </section>
        </div>
        <slot></slot>
      </header>
    `;
  }

  /**
   * Toggles the sidebar's open state.
   */
  private onMenuIconToggle(e: InputEvent) {
    this.isDrawerOpen = !(e.target as MdIconButton).selected;
    this.dispatchEvent(new Event('change'));
  }

  private skipToMain() {
    document.body.dispatchEvent(new CustomEvent(SKIP_TO_MAIN_EVENT));
  }

  static styles = [
    typescaleStyles,
    css`
      :host,
      header {
        display: block;
        height: var(--top-app-bar-height);
      }

      header {
        position: fixed;
        inset: 0 0 auto 0;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding: 12px 16px;
        background-color: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface);
        z-index: 12;
      }

      .default-content {
        width: 100%;
        display: flex;
        align-items: center;
      }

      md-icon-button:not(:defined) {
        width: 40px;
        height: 40px;
        display: flex;
        visibility: hidden;
      }

      md-icon-button * {
        display: block;
      }

      .title {
        color: var(--md-sys-color-primary);
        font-size: 22px;
        text-decoration: none;
        padding-inline: 12px;
        position: relative;
        outline: none;
        vertical-align: middle;
      }

      .start {
        display: flex;
      }

      .start .menu-button {
        display: none;
        --md-icon-button-focus-icon-color: var(--md-sys-color-primary);
        --md-icon-button-icon-color: var(--md-sys-color-primary);
        --md-icon-button-hover-icon-color: var(--md-sys-color-primary);
        --md-icon-button-hover-state-layer-color: var(--md-sys-color-primary);
        --md-icon-button-icon-color: var(--md-sys-color-primary);
        --md-icon-button-pressed-icon-color: var(--md-sys-color-primary);
        --md-icon-button-pressed-state-layer-color: var(--md-sys-color-primary);
      }

      .start .home-button {
        margin: 0 8px;
      }

      .start .home-button * {
        color: var(--md-sys-color-primary);
      }

      .end {
        flex-grow: 1;
        display: flex;
        justify-content: flex-end;
      }

      #menu-island {
        position: relative;
      }

      #skip-to-main {
        padding: 8px;
        border-radius: 12px;
        background-color: var(--md-sys-color-inverse-surface);
        color: var(--md-sys-color-inverse-on-surface);
        opacity: 0;
        position: absolute;
        pointer-events: none;
      }

      #skip-to-main:focus-visible {
        opacity: 1;
        pointer-events: auto;
      }

      @media (max-width: 900px) {
        .start .home-button {
          display: none;
        }

        .start .menu-button {
          display: flex;
        }
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'top-app-bar': TopAppBar;
  }
}
