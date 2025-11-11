import './actions/Attribute.js';
import './actions/ReplyWithCR.js';
import '@material/mwc-circular-progress/mwc-circular-progress.js';

import {html, LitElement, nothing} from 'lit';
import {map} from 'lit/directives/map.js';
import {createRef, ref} from 'lit/directives/ref.js';

import * as pb from '../../../core/proto/main_pb.js';
import {kActionHeadings, kActionStyles, kSupportedActions} from './actions.js';

const actionCases = Object.entries(pb.workflows.Action.ActionCase);

export default class WFActionEditor extends LitElement {
  static properties = {
    action: {type: Object},
    readOnly: {type: Boolean},
    disableRemoveButton: {type: Boolean},
    step: {type: Number},
    status: {type: String},
  };

  static styles = kActionStyles;

  selectRef = createRef();

  constructor() {
    super();
    this.action = new pb.workflows.Action();
    this.readOnly = false;
  }

  renderActionTitle() {
    if (this.readOnly) return html`<h3 class="title">${this._stepTitle()}</h3>`;

    let selectedActionCase = this._actionCase;

    return html`
      <select ${ref(this.selectRef)}
          class="select"
          @change=${this._actionCaseChanged}>
        ${map(actionCases, ([actionName, num]) => {
      if (!kSupportedActions.has(num)) return nothing;
      return html`
          <option value=${num} ?selected=${selectedActionCase == num}>
            ${kActionHeadings[num] ?? actionName}
          </option>
        `;
    })}
      </select>
    `;
  }

  renderSpecificActionEditor() {
    switch (this._actionCase) {
      case pb.workflows.Action.ActionCase.REPLY_WITH_CR_ACTION:
        return html`
          <wf-action-reply-with-cr
              ?readOnly=${this.readOnly}
              .action=${this.action.getReplyWithCrAction()}>
          </wf-action-reply-with-cr>
        `;

      case pb.workflows.Action.ActionCase.ATTRIBUTE_ACTION:
        return html`
          <wf-action-attribute
              ?readOnly=${this.readOnly}
              .action=${this.action.getAttributeAction()}>
          </wf-action-attribute>
        `;

      case pb.workflows.Action.ActionCase.MARK_AS_READ_ACTION:
      case pb.workflows.Action.ActionCase.MARK_AS_UNREAD_ACTION:
        return nothing;

      default:
        return html`<p>This action has not yet been implemented.</p>`;
    }
  }

  render() {
    let actionClass = '';
    if (this.readOnly && this.status) actionClass = 'action--' + this.status;
    return html`
      <div class="action ${actionClass}">
        <div class="header">
          <div class="step">
            ${this.step}
            ${
        this.status == 'running' ?
            html`<mwc-circular-progress indeterminate density="-1"></mwc-circular-progress>` :
            ''}
          </div>
          ${this.renderActionTitle()}
          ${
    !this.readOnly ? html`
              <button
                  ?disabled=${this.disableRemoveButton}
                  @click=${this._remove}>
                Remove
              </button>
            ` :
                     nothing}
        </div>
        ${this.renderSpecificActionEditor()}
      </div>
    `;
  }

  checkValidity() {
    if (this.readOnly || !kSupportedActions.has(this._actionCase)) return true;

    const s = this._specificActionEditor();
    if (!s) return true;

    return this._specificActionEditor().checkValidity();
  }

  _actionCaseChanged() {
    this._actionCaseString = this.selectRef.value.value;
  }

  _dispatchUpdateEvent() {
    // Transmit to other components that the action has changed
    const e = new Event('action-updated', {bubbles: true, composed: true});
    this.renderRoot.dispatchEvent(e);
  }

  _remove() {
    // Transmit to other components that the action has to be removed
    const e = new Event('action-removed', {bubbles: true, composed: true});
    this.renderRoot.dispatchEvent(e);
  }

  _stepTitle() {
    return kActionHeadings[this._actionCase] ?? this._actionCase;
  }

  get _actionCase() {
    return this.action.getActionCase();
  }

  set _actionCase(newCase) {
    let value;
    switch (newCase) {
      case pb.workflows.Action.ActionCase.REPLY_ACTION:
        value = new pb.workflows.Action.ReplyAction;
        this.action.setReplyAction(value);
        break;
      case pb.workflows.Action.ActionCase.MOVE_ACTION:
        value = new pb.workflows.Action.MoveAction;
        this.action.setMoveAction(value);
        break;
      case pb.workflows.Action.ActionCase.MARK_DUPLICATE_ACTION:
        value = new pb.workflows.Action.MarkDuplicateAction;
        this.action.setMarkDuplicateAction(value);
        break;
      case pb.workflows.Action.ActionCase.UNMARK_DUPLICATE_ACTION:
        value = new pb.workflows.Action.UnmarkDuplicateAction;
        this.action.setUnmarkDuplicateAction(value);
        break;
      case pb.workflows.Action.ActionCase.ATTRIBUTE_ACTION:
        value = new pb.workflows.Action.AttributeAction;
        this.action.setAttributeAction(value);
        break;
      case pb.workflows.Action.ActionCase.REPLY_WITH_CR_ACTION:
        value = new pb.workflows.Action.ReplyWithCRAction;
        this.action.setReplyWithCrAction(value);
        break;
      case pb.workflows.Action.ActionCase.STAR_ACTION:
        value = new pb.workflows.Action.StarAction;
        this.action.setStarAction(value);
        break;
      case pb.workflows.Action.ActionCase.SUBSCRIBE_ACTION:
        value = new pb.workflows.Action.SubscribeAction;
        this.action.setSubscribeAction(value);
        break;
      case pb.workflows.Action.ActionCase.VOTE_ACTION:
        value = new pb.workflows.Action.VoteAction;
        this.action.setVoteAction(value);
        break;
      case pb.workflows.Action.ActionCase.REPORT_ACTION:
        value = new pb.workflows.Action.ReportAction;
        this.action.setReportAction(value);
        break;
      case pb.workflows.Action.ActionCase.MARK_AS_READ_ACTION:
        value = new pb.workflows.Action.MarkAsReadAction;
        this.action.setMarkAsReadAction(value);
        break;
      case pb.workflows.Action.ActionCase.MARK_AS_UNREAD_ACTION:
        value = new pb.workflows.Action.MarkAsUnreadAction;
        this.action.setMarkAsUnreadAction(value);
        break;
      default:
        this.action.clearReplyAction();
        this.action.clearMoveAction();
        this.action.clearMarkDuplicateAction();
        this.action.clearUnmarkDuplicateAction();
        this.action.clearAttributeAction();
        this.action.clearReplyWithCrAction();
        this.action.clearStarAction();
        this.action.clearSubscribeAction();
        this.action.clearVoteAction();
        this.action.clearReportAction();
        this.action.clearMarkAsReadAction();
        this.action.clearMarkAsUnreadAction();
    }

    this.requestUpdate();
    this._dispatchUpdateEvent();
  }

  // The same as _actionCase, but represented as a String instead of a Number
  get _actionCaseString() {
    return this._actionCase.toString();
  }

  set _actionCaseString(newCase) {
    this._actionCase = parseInt(newCase);
  }

  _specificActionEditor() {
    switch (this._actionCase) {
      case pb.workflows.Action.ActionCase.REPLY_WITH_CR_ACTION:
        return this.renderRoot.querySelector('wf-action-reply-with-cr');

      case pb.workflows.Action.ActionCase.ATTRIBUTE_ACTION:
        return this.renderRoot.querySelector('wf-action-attribute');

      default:
        return null;
    }
  }
}
window.customElements.define('wf-action-editor', WFActionEditor);
