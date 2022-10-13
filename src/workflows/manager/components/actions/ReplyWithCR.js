import '@material/web/textfield/outlined-text-field.js';
import '@material/web/switch/switch.js';
import '@material/web/formfield/formfield.js';

import {html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {CCApi} from '../../../../common/api.js';
import * as pb from '../../../proto/main_pb.js';

export default class WFActionReplyWithCR extends LitElement {
  static properties = {
    action: {type: Object},
    readOnly: {type: Boolean},
  };

  cannedResponseRef = createRef();
  subscribeRef = createRef();
  markAsAnswerRef = createRef();

  constructor() {
    super();
    this.action = new pb.workflows.Action.ReplyWithCRAction;
    // this._loadUserCannedResponses();
  }

  render() {
    return html`
      <p>
        <md-outlined-text-field ${ref(this.cannedResponseRef)}
            type="number"
            label="Canned response ID"
            required
            value=${this._cannedResponseIdString}
            ?readonly=${this.readOnly}
            @input=${this._cannedResponseIdChanged}>
        </md-outlined-text-field>
      </p>
      <p>
        <md-formfield label="Subscribe to thread">
          <md-switch ${ref(this.subscribeRef)}
              ?selected=${this.subscribe}
              ?disabled=${this.readOnly}
              @click=${this._subscribeChanged}/>
        </md-formfield>
      </p>
      <p>
        <md-formfield label="Mark as answer">
          <md-switch ${ref(this.markAsAnswerRef)}
              ?selected=${this.markAsAnswer}
              ?disabled=${this.readOnly}
              @click=${this._markAsAnswerChanged}/>
        </md-formfield>
      </p>
    `;
  }

  checkValidity() {
    return this.cannedResponseRef.value.reportValidity();
  }

  _loadUserCannedResponses() {
    if (window.USER_CANNED_RESPONSES_STARTED_TO_LOAD) return;

    window.USER_CANNED_RESPONSES_STARTED_TO_LOAD = true;
    let searchParams = new URLSearchParams(document.location.search);
    let authuser = searchParams.get('authuser') ?? 0;

    // @TODO: This isn't as simple as doing this because the request contains
    // the wrong origin and fails.
    CCApi('ListCannedResponses', {}, true, authuser).then(res => {
      console.log(res);
    });
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
