import '@material/web/formfield/formfield.js';
import '@material/web/switch/switch.js';
import '@material/web/textfield/outlined-text-field.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {CCApi} from '../../../../common/api.js';
import * as pb from '../../../proto/main_pb.js';

export default class WFActionReplyWithCR extends LitElement {
  static properties = {
    action: {type: Object},
    readOnly: {type: Boolean},
    _importerWindow: {type: Object, state: true},
  };

  static styles = css`
    .form-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-block: 1em;
      gap: .5rem;
    }
  `;

  cannedResponseRef = createRef();
  subscribeRef = createRef();
  markAsAnswerRef = createRef();

  constructor() {
    super();
    this.action = new pb.workflows.Action.ReplyWithCRAction;
    this._importerWindow = undefined;

    window.addEventListener('message', e => {
      if (e.source === this._importerWindow &&
          e.data?.action === 'importCannedResponse') {
        this._cannedResponseIdString = e.data?.cannedResponseId;
        this._importerWindow?.close?.();
      }
    });
  }

  render() {
    return html`
      <div class="form-line">
        <md-outlined-text-field ${ref(this.cannedResponseRef)}
            type="number"
            label="Canned response ID"
            required
            value=${this._cannedResponseIdString}
            ?readonly=${this.readOnly}
            @input=${this._cannedResponseIdChanged}>
        </md-outlined-text-field>
        <md-outlined-button
            icon="more"
            label="Select CR"
            @click=${this._openCRImporter}>
        </md-outlined-button>
      </div>
      <div class="form-line">
        <md-formfield label="Subscribe to thread">
          <md-switch ${ref(this.subscribeRef)}
              ?selected=${this.subscribe}
              ?disabled=${this.readOnly}
              @click=${this._subscribeChanged}/>
        </md-formfield>
      </div>
      <div class="form-line">
        <md-formfield label="Mark as answer">
          <md-switch ${ref(this.markAsAnswerRef)}
              ?selected=${this.markAsAnswer}
              ?disabled=${this.readOnly}
              @click=${this._markAsAnswerChanged}/>
        </md-formfield>
      </div>
    `;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._importerWindow?.close?.();
  }

  checkValidity() {
    return this.cannedResponseRef.value.reportValidity();
  }

  _dispatchUpdateEvent() {
    // Request an update for this component
    this.requestUpdate();

    // Transmit to other components that the action has changed
    const e = new Event(
        'replywithcr-action-updated', {bubbles: true, composed: true});
    this.renderRoot.dispatchEvent(e);
  }

  _cannedResponseIdChanged() {
    this._cannedResponseIdString = this.cannedResponseRef.value.value;
  }

  _subscribeChanged() {
    this.subscribe = this.subscribeRef.value.selected;
  }

  _markAsAnswerChanged() {
    this.markAsAnswer = this.markAsAnswerRef.value.selected;
  }

  _openCRImporter() {
    if (!(this._importerWindow?.closed ?? true))
      this._importerWindow?.close?.();

    this._importerWindow = window.open(
        'https://support.google.com/s/community/cannedresponses?TWPTImportToWorkflow&TWPTSelectedId=' +
            encodeURIComponent(this._cannedResponseIdString),
        '', 'popup,width=720,height=540');
  }

  get cannedResponseId() {
    return this.action.getCannedResponseId() ?? 0;
  }

  set cannedResponseId(value) {
    this.action.setCannedResponseId(value);
    this._dispatchUpdateEvent();
  }

  get _cannedResponseIdString() {
    let id = this.cannedResponseId;
    if (id == 0) return '';
    return id.toString();
  }

  set _cannedResponseIdString(value) {
    this.cannedResponseId = parseInt(value);
  }

  get subscribe() {
    return this.action.getSubscribe();
  }

  set subscribe(value) {
    this.action.setSubscribe(value);
    this._dispatchUpdateEvent();
  }

  get markAsAnswer() {
    return this.action.getMarkAsAnswer();
  }

  set markAsAnswer(value) {
    this.action.setMarkAsAnswer(value);
    this._dispatchUpdateEvent();
  }
}
window.customElements.define('wf-action-reply-with-cr', WFActionReplyWithCR);
