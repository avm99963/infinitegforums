import '@material/web/button/outlined-button.js';
import './ActionEditor.js';

import {html, LitElement, nothing} from 'lit';
import {repeat} from 'lit/directives/repeat.js';

import * as pb from '../../proto/main_pb.js';

export default class WFWorkflowEditor extends LitElement {
  static properties = {
    workflow: {type: Object},
    readOnly: {type: Boolean},
  };

  constructor() {
    super();
    this.workflow = new pb.workflows.Workflow();
    this.readOnly = false;
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
      this.renderActions(),
      this.renderAddActionBtn(),
    ];
  }

  save() {
    let allValid = true;
    const actionEditors = this.renderRoot.querySelectorAll('wf-action-editor');
    for (const editor of actionEditors) {
      const isValid = editor.checkValidity();
      if (!isValid) allValid = false;
    }
    // @TODO: Save if allValid === true
    return allValid;
  }

  _actions() {
    return this.workflow.getActionsList();
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
