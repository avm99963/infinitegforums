import '@material/web/formfield/formfield.js';
import '@material/web/icon/icon.js';
import '@material/web/switch/switch.js';

import consoleCommonStyles from '!!raw-loader!../../../../static/css/common/console.css';
import {css, html, LitElement, nothing, unsafeCSS} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';
import {kEventFlattenThreadsUpdated} from '../constants.js';

export default class TwptThreadToolbarInject extends LitElement {
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
        padding-top: 0.5rem;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
        padding-bottom: 0.5rem;
      }

      .badge-container {
        padding-right: 0.5rem;
        border-right: solid gray 1px;
        margin-right: 0.5rem;
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

    return html`
      <md-formfield label="Nested view">
        <md-switch ${ref(this.nestedViewRef)}
            ?selected=${!this.options?.flattenthreads_switch_enabled}
            @click=${this._flattenThreadsChanged}>
      </md-formfield>
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
