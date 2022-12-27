import '@material/web/formfield/formfield.js';
import '@material/web/switch/switch.js';

import {css, html, LitElement, nothing} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';
import {kEventFlattenThreadsUpdated} from '../constants.js';

export default class TwptThreadToolbarInject extends LitElement {
  static properties = {
    options: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        display: flex;
        flex-direction: row;
        padding-top: 1.5rem;
        padding-left: 0.25rem;
        padding-right: 0.25rem;
        padding-bottom: 0.5rem;
      }
    `,
  ];

  nestedViewRef = createRef();

  constructor() {
    super();
    this.options = {};
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
    return html`
      ${this.renderFlattenRepliesSwitch()}
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
