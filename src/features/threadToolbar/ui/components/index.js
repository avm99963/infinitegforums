import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/switch/switch.js';
import '../../../../common/components/FormField.js';

import consoleCommonStyles from '!!raw-loader!../../../../static/css/common/console.css';
import {msg} from '@lit/localize';
import {Corner} from '@material/web/menu/menu.js';
import {css, html, nothing, unsafeCSS} from 'lit';
import {map} from 'lit/directives/map.js';
import {createRef, ref} from 'lit/directives/ref.js';

import {I18nLitElement} from '../../../../ui/i18n/i18nLitElement';
import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';
import {kEventOptionUpdatedFromToolbar} from '../../core/constants';

const appleProductRegex = /(macos|macintosh|iphone|ipod|ipad)/i;
const isMac = () => appleProductRegex.test(navigator.userAgentData?.platform) ||
    appleProductRegex.test(navigator.userAgent);

const getOverflowMenuItems = (options) =>
    [{
      label: msg('Bulk report replies', {
        desc:
            'Option shown in the settings menu of the thread toolbar which enables the "bulk report replies" feature.',
      }),
      supportingText: isMac() ?
          msg('(⌥ + R)', {
            desc:
                'Text shown to Mac users below the "bulk report replies" toggle, to let them know that they can use this keyboard shortcut to toggle it.',
          }) :
          msg('(Alt + R)', {
            desc:
                'Text shown below the "bulk report replies" toggle, to let the user know that they can use this keyboard shortcut to toggle it.',
          }),
      isShown: options['bulkreportreplies'] === true,
      option: 'bulkreportreplies_switch_enabled'
    },
].filter(item => item.isShown);

export default class TwptThreadToolbarInject extends I18nLitElement {
  static properties = {
    options: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`${unsafeCSS(consoleCommonStyles)}`,
    css`
      :host {
        display: block;
        padding-top: 1rem;
      }

      .toolbar {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        row-gap: 0.5rem;
        padding: 0.5rem 0.25rem;
      }

      .toolbar-start, .toolbar-end {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        row-gap: 0.5rem;
      }

      .badge-container {
        padding-inline-end: 0.5rem;
        border-inline-end: solid gray 1px;
        margin-inline-end: 0.5rem;
      }

      .TWPT-badge {
        --icon-size: 17px;
      }
    `,
  ];

  nestedViewRef = createRef();
  overflowMenuRef = createRef();

  constructor() {
    super();
    this.options = {};
  }

  renderBadge() {
    return html`
      <div class="badge-container">
        <div class="TWPT-badge">
          <md-icon>repeat</md-icon>
        </div>
      </div>
    `;
  }

  renderFlattenRepliesSwitch() {
    if (!this.options.flattenthreads) return nothing;

    const nestedViewMsg = msg('Nested view', {
      desc:
          'Label for the switch which lets users enable/disable the nested view in a thread.',
    });
    return html`
      <twpt-form-field>
        <md-switch ${ref(this.nestedViewRef)}
            ?selected=${!this.options?.flattenthreads_switch_enabled}
            @change=${this._flattenThreadsChanged}>
        </md-switch>
        <span slot="label">
          ${nestedViewMsg}
        </span>
      </twpt-form-field>
    `;
  }

  renderOverflowMenu() {
    const items = getOverflowMenuItems(this.options);

    if (items.length === 0) return nothing;

    return html`
      <md-icon-button
          id="thread-toolbar-overflow-menu-anchor"
          @click="${this._toggleOverflowMenu}">
        <md-icon>settings</md-icon>
      </md-icon-button>
      <md-menu ${ref(this.overflowMenuRef)}
          anchor="thread-toolbar-overflow-menu-anchor"
          anchor-corner="${Corner.END_END}"
          menu-corner="${Corner.START_END}"
          positioning="popover">
        ${
        map(items,
            item => html`
          <md-menu-item
              @click="${
                () => this._onOptionChanged(
                    item.option, !this.options[item.option], false)}">
            <md-icon slot="start">${
                this.options[item.option] ? 'check' : ''}</md-icon>
              <span>
                ${item.label}
              </span>
              ${item.supportingText && html`
                <span slot="supporting-text">
                  ${item.supportingText}
                </span>
              `}
          </md-menu-item>
        `)}
      </md-menu>
    `;
  }

  render() {
    // NOTE: Keep this in sync!
    if (!this.options.flattenthreads && !this.options.bulkreportreplies)
      return nothing;

    return html`
      <div class="toolbar">
        <div class="toolbar-start">
          ${this.renderBadge()}
          ${this.renderFlattenRepliesSwitch()}
        </div>
        <div class="toolbar-end">
          ${this.renderOverflowMenu()}
        </div>
      </div>
    `;
  }

  _flattenThreadsChanged() {
    const enabled = !this.nestedViewRef.value.selected;
    this._onOptionChanged('flattenthreads_switch_enabled', enabled, true);
  }

  _onOptionChanged(option, enabled, softRefreshView = false) {
    const e = new CustomEvent(kEventOptionUpdatedFromToolbar, {
      bubbles: true,
      composed: true,
      detail: {option, enabled, softRefreshView},
    });
    this.dispatchEvent(e);
  }

  _toggleOverflowMenu() {
    this.overflowMenuRef.value.open = !this.overflowMenuRef.value.open;
  }
}
window.customElements.define(
    'twpt-thread-toolbar-inject', TwptThreadToolbarInject);
