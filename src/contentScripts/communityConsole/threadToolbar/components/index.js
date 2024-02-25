import '@material/web/icon/icon.js';
import '@material/web/switch/switch.js';
import '../../../../common/components/FormField.js';

import consoleCommonStyles from '!!raw-loader!../../../../static/css/common/console.css';
import {msg} from '@lit/localize';
import {css, html, nothing, unsafeCSS} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {I18nLitElement} from '../../../../common/litI18nUtils.js';
import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';
import {kEventFlattenThreadsUpdated} from '../constants.js';

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
        flex-flow: row wrap;
        align-items: center;
        row-gap: 0.5rem;
        padding: 0.5rem 0.25rem;
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

  render() {
    // NOTE: Keep this in sync!
    if (!this.options.flattenthreads) return nothing;

    return html`
      <div class="toolbar">
        ${this.renderBadge()}
        ${this.renderFlattenRepliesSwitch()}
      </div>
    `;
  }

  _flattenThreadsChanged() {
    const enabled = !this.nestedViewRef.value.selected;
    const e = new CustomEvent(kEventFlattenThreadsUpdated, {
      bubbles: true,
      composed: true,
      detail: {enabled},
    });
    this.dispatchEvent(e);
  }
}
window.customElements.define(
    'twpt-thread-toolbar-inject', TwptThreadToolbarInject);
