import '@material/web/button/outlined-button.js';
import '@material/web/textfield/filled-text-field.js';
import './ActionEditor.js';

import {css, html, LitElement, nothing} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';
import {repeat} from 'lit/directives/repeat.js';

import * as pb from '../../proto/main_pb.js';
import WorkflowsStorage from '../../workflowsStorage.js';

export default class WFWorkflowEditor extends LitElement {
  static properties = {
    workflow: {type: Object},
    readOnly: {type: Boolean},
  };

  static styles = css`
    .name {
      width: 100%;
      margin-bottom: 20px;
    }
  `;

  nameRef = createRef();

  constructor() {
    super();
    this.workflow = new pb.workflows.Workflow();
    this.readOnly = false;
  }

  renderName() {
    return html`
      <md-filled-text-field ${ref(this.nameRef)}
          class="name"
          placeholder="Untitled workflow"
          value=${this.workflow.getName()}
          required
          @input=${this._nameChanged}>
      </md-filled-text-field>
    `;
  }

  renderActions() {
    return repeat(this._actions(), (action, i) => html`
      <wf-action-editor
          .action=${action}
          ?readOnly=${this.readOnly}
          ?disableRemoveButton=${this._actions().length <= 1}
          step=${i + 1}
          @action-removed=${() => this._removeAction(i)}>
      </wf-action-editor>
    `);
  }

  renderAddActionBtn() {
    if (this.readOnly) return nothing;
    return html`
      <md-outlined-button
          icon="add"
          label="Add another action"
          @click=${this._addAction}>
      </md-outlined-button>
    `;
  }

  render() {
    return [
      this.renderName(),
      this.renderActions(),
      this.renderAddActionBtn(),
    ];
  }

  save() {
    let allValid = true;

    // Check the workflow name is set
    allValid &&= this.nameRef.value.reportValidity();

    // Check all the actions are well-formed
    const actionEditors = this.renderRoot.querySelectorAll('wf-action-editor');
    for (const editor of actionEditors) allValid &&= editor.checkValidity();

    // Save the workflow if the validation checks passed
    if (allValid) WorkflowsStorage.add(this.workflow);

    return allValid;
  }

  _actions() {
    return this.workflow.getActionsList();
  }

  _nameChanged() {
    this.workflow.setName(this.nameRef.value.value);
    this._dispatchUpdateEvent();
  }

  _addAction() {
    let action = new pb.workflows.Action();
    let rAction = new pb.workflows.Action.ReplyWithCRAction();
    action.setReplyWithCrAction(rAction);
    this.workflow.addActions(action);
    this._dispatchUpdateEvent();
  }

  _removeAction(index) {
    let actions = this.workflow.getActionsList();
    actions.splice(index, 1);
    this.workflow.setActionsList(actions);
    this._dispatchUpdateEvent();
  }

  _updateAction(index, action) {
    let actions = this.workflow.getActionsList();
    actions[index] = action;
    this.workflow.setActionsList(actions);
    this._dispatchUpdateEvent();
  }

  _dispatchUpdateEvent() {
    // Request an update for this component
    this.requestUpdate();

    // Transmit to other components that the workflow has changed
    const e = new Event('workflow-updated', {bubbles: true, composed: true});
    this.renderRoot.dispatchEvent(e);
  }
}
window.customElements.define('wf-workflow-editor', WFWorkflowEditor);
