import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';

import {html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../../../common/styles/md3.js';
import * as pb from '../../../../core/proto/main_pb.js';

import {FORM_STYLES} from './common.js';

const kHiddenActions = [
  pb.workflows.Action.AttributeAction.AttributeAction.AA_NONE,
];

export default class WFActionAttribute extends LitElement {
  static properties = {
    action: {type: Object},
    readOnly: {type: Boolean},
  };

  static styles = [
    SHARED_MD3_STYLES,
    FORM_STYLES,
  ];

  attributeActionRef = createRef();

  constructor() {
    super();
    this.action = new pb.workflows.Action.AttributeAction;
  }

  render() {
    return html`
      <div class="form-line">
        <md-outlined-select ${ref(this.attributeActionRef)}
            required
            label="Action"
            value=${this.action}
            ?disabled=${this.readOnly}
            @change=${this._attributeActionChanged}>
          ${this.renderAttributeActions()}
        </md-outlined-select>
      </div>
    `;
  }

  renderAttributeActions() {
    const attributeActions =
        Object.entries(pb.workflows.Action.AttributeAction.AttributeAction);
    return attributeActions.filter(([, id]) => !kHiddenActions.includes(id))
        .map(([actionCodename, id]) => html`
      <md-select-option value=${id}>
        <div slot="headline">${actionCodename}</div>
      </md-select-option>
    `);
  }

  checkValidity() {
    return this.attributeActionRef.value.reportValidity();
  }

  _dispatchUpdateEvent() {
    // Request an update for this component
    this.requestUpdate();

    // Transmit to other components that the action has changed
    const e =
        new Event('attribute-action-updated', {bubbles: true, composed: true});
    this.renderRoot.dispatchEvent(e);
  }

  _attributeActionChanged() {
    this.attributeAction = this.attributeActionRef.value.value;
  }

  get attributeAction() {
    return this.action.getAttributeAction();
  }

  set attributeAction(value) {
    this.action.setAttributeAction(value);
    this._dispatchUpdateEvent();
  }
}
window.customElements.define('wf-action-attribute', WFActionAttribute);
