import '@material/web/icon/icon.js';
import '@material/web/switch/switch.js';
import '@material/web/textfield/outlined-text-field.js';
import '../../../../../../common/components/FormField.js';

import {css, html, LitElement, nothing} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../../../common/styles/md3.js';
import * as pb from '../../../proto/main_pb.js';
import { FORM_STYLES } from './common.js';

export default class WFActionReplyWithCR extends LitElement {
  static properties = {
    action: {type: Object},
    readOnly: {type: Boolean},
    _importerWindow: {type: Object, state: true},
  };

  static styles = [
    SHARED_MD3_STYLES,
    FORM_STYLES,
    css`
      .select-cr-btn {
        --md-outlined-button-icon-size: 24px;
      }

      .disabled-notice {
        align-items: flex-start;
        color: var(--md-sys-color-error);

        .disabled-notice-text {
          display: flex;
          flex-direction: column;

          & > :not(:last-child) {
            margin-bottom: 4px;
          }
        }
      }
    `,
  ];

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
      ${this.maybeRenderDisabledNotice()}
      <div class="form-line">
        <md-outlined-text-field ${ref(this.cannedResponseRef)}
            type="number"
            label="Canned response ID"
            required
            value=${this._cannedResponseIdString}
            ?readonly=${this.readOnly}
            @input=${this._cannedResponseIdChanged}>
        </md-outlined-text-field>
        ${this.readOnly ? nothing : html`
          <md-outlined-button
              class="select-cr-btn"
              @click=${this._openCRImporter}>
            <md-icon slot="icon" filled>more</md-icon>
            Select CR
          </md-outlined-button>
        `}
      </div>
      <div class="form-line">
        <twpt-form-field>
          <md-switch ${ref(this.subscribeRef)}
              ?selected=${this.subscribe}
              ?disabled=${this.readOnly}
              @change=${this._subscribeChanged}/>
          </md-switch>
          <span slot="label">
            Subscribe to thread
          </span>
        </twpt-form-field>
      </div>
      <div class="form-line">
        <twpt-form-field>
          <md-switch ${ref(this.markAsAnswerRef)}
              ?selected=${this.markAsAnswer}
              ?disabled=${this.readOnly}
              @change=${this._markAsAnswerChanged}/>
          </md-switch>
          <span slot="label">
            Mark as answer
          </span>
        </twpt-form-field>
      </div>
    `;
  }

  maybeRenderDisabledNotice() {
    // #!if !enable_bulk_crs
    return html`
      <div class="form-line disabled-notice">
        <md-icon>warning</md-icon>
        <div class="disabled-notice-text">
          <span>Replying with CRs in workflows <a href="https://groups.google.com/g/twpowertools-discuss/c/676mUvH4mAM/m/lhqxxQSuAgAJ" target="_blank" rel="noopener noreferrer">has been temporarily disabled</a>.</span>
          <span>This action will not be executed.</span>
        </span>
      </div>
    `;
    // #!else
    return nothing;
    // #!endif
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
