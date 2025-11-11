/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 * Heavily modified for use in the TW Power Tools project.
 * Based on https://github.com/material-components/material-web/blob/2206d7f01ccdcc80f1df7af17261cc6e74cd6ac6/catalog/src/components/nav-drawer.ts.
 */

import { animate, fadeIn, fadeOut } from '@lit-labs/motion';
import { EASING } from '@material/web/internal/motion/animation.js';
import { LitElement, PropertyValues, css, html, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * A layout element that positions the top-app-bar, the main page content, and
 * the side navigation drawer.
 *
 * The drawer will automatically set itself as collapsible at narrower page
 * widths, and position itself inline with the page at wider page widths.
 */
@customElement('nav-drawer')
export class NavDrawer extends LitElement {
  /**
   * Whether the drawer is open.
   */
  @property({ type: Boolean })
  accessor isOpen = false;

  /**
   * Whether or not the side drawer is collapsible or inline.
   */
  @state()
  private accessor isCollapsible = false;

  render() {
    const showModal = this.isCollapsible && this.isOpen;

    // Values taken from internal material motion spec
    const drawerSlideAnimationDuration = showModal ? 500 : 150;
    const drawerContentOpacityDuration = showModal ? 300 : 150;
    const scrimOpacityDuration = 150;

    const drawerSlideAnimationEasing = showModal
      ? EASING.EMPHASIZED
      : EASING.EMPHASIZED_ACCELERATE;

    return html`
      <div class="root">
        <slot name="top-app-bar"></slot>
        <div class="body ${this.isOpen ? 'open' : ''}">
          <div class="spacer">
            ${showModal
              ? html`
                  <div
                    class="scrim"
                    @click=${this.onScrimClick}
                    ${animate({
                      properties: ['opacity'],
                      keyframeOptions: {
                        duration: scrimOpacityDuration,
                        easing: 'linear',
                      },
                      in: fadeIn,
                      out: fadeOut,
                    })}
                  ></div>
                `
              : nothing}
            <aside
              ?inert=${this.isCollapsible && !this.isOpen}
              ${animate({
                properties: ['transform'],
                keyframeOptions: {
                  duration: drawerSlideAnimationDuration,
                  easing: drawerSlideAnimationEasing,
                },
              })}
            >
              <div class="scroll-wrapper">
                <slot
                  ${animate({
                    properties: ['opacity'],
                    keyframeOptions: {
                      duration: drawerContentOpacityDuration,
                      easing: 'linear',
                    },
                  })}
                ></slot>
              </div>
            </aside>
          </div>
          <div class="panes">${this.renderContent(showModal)}</div>
        </div>
      </div>
    `;
  }

  private renderContent(showModal: boolean) {
    return html`
      <div class="pane content-pane">
        <div class="scroll-wrapper" ?inert=${showModal}>
          <div class="content">
            <slot name="app-content"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Scrolls the app content to the top.
   */
  scrollAppContentToTop() {
    this.shadowRoot
      .querySelector('.content-pane .scroll-wrapper')
      ?.scrollTo({ top: 0, left: 0 });
  }

  /**
   * Closes the drawer on scrim click.
   */
  private onScrimClick() {
    this.isOpen = false;
    this.dispatchEvent(new Event('change'));
  }

  firstUpdated() {
    const queryResult = window.matchMedia('(max-width: 900px)');
    this.isCollapsible = queryResult.matches;

    // Listen for page resizes to mark the drawer as collapsible.
    queryResult.addEventListener('change', (e) => {
      this.isCollapsible = e.matches;
    });
  }

  updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (
      changed.has('isOpen') &&
      this.isOpen !== changed.get('isOpen') &&
      this.isOpen &&
      this.isCollapsible
    ) {
      (this.querySelector('categories-selector') as HTMLElement)?.focus?.();
    }
  }

  static styles = css`
    :host {
      --_drawer-width: 300px;
      /* When in wide mode inline start margin is handled by the sidebar */
      --_pane-margin-inline-start: 0px;
      --_pane-margin-inline-end: 16px;
      --_pane-margin-block-end: 16px;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;

      font-family:
        'Roboto',
        -apple-system,
        BlinkMacSystemFont,
        'Segoe UI',
        Helvetica,
        Arial,
        sans-serif,
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol' !important;
    }

    ::slotted(nav) {
      list-style: none;
    }

    .body {
      display: flex;
      flex-grow: 1;
    }

    .spacer {
      position: relative;
      transition: min-width 0.5s cubic-bezier(0.3, 0, 0, 1);
    }

    .spacer,
    aside {
      min-width: var(--_drawer-width);
      max-width: var(--_drawer-width);
    }

    .pane {
      box-sizing: border-box;
      overflow: auto;
      width: 100%;
      /* Explicit height to make overflow work */
      height: calc(
        100dvh - var(--top-app-bar-height) - var(--_pane-margin-block-end)
      );
      background-color: var(--md-sys-color-surface);
      border-radius: 28px;
    }

    .pane,
    .panes {
      /* emphasized – duration matching render fn for sidebar */
      transition: 0.5s cubic-bezier(0.3, 0, 0, 1);
      transition-property: margin, height, border-radius, max-width, width;
    }

    .panes {
      display: flex;
      justify-content: start;
      flex-direction: row-reverse;
      gap: var(--_pane-margin-inline-end);
      margin-inline: var(--_pane-margin-inline-start)
        var(--_pane-margin-inline-end);
      width: 100%;
      max-width: calc(
        100% - var(--_drawer-width) - var(--_pane-margin-inline-start) - var(
            --_pane-margin-inline-end
          )
      );
    }

    .content {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      padding-inline: 28px;
      width: 100%;
    }

    .content slot {
      display: block;
      width: 100%;
      max-width: min(100%, var(--_max-width));
    }

    aside {
      transition: transform 0.5s cubic-bezier(0.3, 0, 0, 1);
      position: fixed;
      isolation: isolate;
      inset: var(--top-app-bar-height) 0 0 0;
      z-index: 12;
      background-color: var(--md-sys-color-surface-container);
      overflow: hidden;
    }

    .scroll-wrapper {
      overflow-y: auto;
      max-height: 100%;
      border-radius: inherit;
      box-sizing: border-box;
    }

    .pane .scroll-wrapper {
      padding-block: 28px;
    }

    aside slot {
      display: block;
    }

    .scrim {
      background-color: rgba(0, 0, 0, 0.32);
    }

    @media (max-width: 900px) {
      .spacer {
        min-width: 0px;
      }

      .panes {
        max-width: calc(
          100% - var(--_pane-margin-inline-start) - var(
              --_pane-margin-inline-end
            )
        );
      }

      .content {
        max-width: 100vw;
        padding-inline: 28px;
      }

      .scrim {
        position: fixed;
        inset: 0;
      }

      aside {
        transition: unset;
        transform: translateX(-100%);
        border-radius: 0 28px 28px 0;
      }

      :host {
        --_pane-margin-inline-start: 28px;
      }

      .open aside {
        transform: translateX(0);
      }

      aside slot {
        opacity: 0;
      }

      .open aside slot {
        opacity: 1;
      }

      .open .scrim {
        inset: 0;
        z-index: 11;
      }
    }

    @media (max-width: 600px) {
      .pane {
        border-end-start-radius: 0;
        border-end-end-radius: 0;
      }

      :host {
        --_pane-margin-block-end: 0px;
        --_pane-margin-inline-start: 0px;
        --_pane-margin-inline-end: 0px;
      }
    }

    /* On desktop, make the scrollbars less blocky so you can see the border
     * radius of the pane. On most mobile platforms, these scrollbars are hidden
     * by default. It'll still unfortunately render on top of the border radius.
     */
    @media (pointer: fine) {
      :host {
        --_scrollbar-width: 8px;
      }

      .scroll-wrapper {
        /* firefox */
        scrollbar-color: var(--md-sys-color-primary) transparent;
        scrollbar-width: thin;
      }

      .content {
        /* adjust for the scrollbar width */
        padding-inline-end: calc(28px - var(--_scrollbar-width));
      }

      /* Chromium + Safari */
      .scroll-wrapper::-webkit-scrollbar {
        background-color: transparent;
        width: var(--_scrollbar-width);
      }

      .scroll-wrapper::-webkit-scrollbar-thumb {
        background-color: var(--md-sys-color-primary);
        border-radius: calc(var(--_scrollbar-width) / 2);
      }
    }

    @media (forced-colors: active) {
      .pane {
        border: 1px solid CanvasText;
      }

      @media (max-width: 900px) {
        aside {
          box-sizing: border-box;
          border: 1px solid CanvasText;
        }

        .scrim {
          background-color: rgba(0, 0, 0, 0.75);
        }
      }

      @media (pointer: fine) {
        .scroll-wrapper {
          /* firefox */
          scrollbar-color: CanvasText transparent;
        }

        .scroll-wrapper::-webkit-scrollbar-thumb {
          /* Chromium + Safari */
          background-color: CanvasText;
        }
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'nav-drawer': NavDrawer;
  }
}
