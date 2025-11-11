import '@material/mwc-dialog/mwc-dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import './WorkflowEditor.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import * as pb from '../../../core/proto/main_pb.js';

export default class WFAddDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
  };

  static styles = css`
    :host {
      --mdc-dialog-content-ink-color: var(--mdc-theme-on-surface, #000);
    }
  `;

  workflowEditorRef = createRef();

  constructor() {
    super();
    this.open = false;
  }

  render() {
    return html`
      <mwc-dialog
          ?open=${this.open}
          @opening=${this._openingDialog}
          @closing=${this._closingDialog}
          @closed=${this._closedDialog}>
        <wf-workflow-editor ${ref(this.workflowEditorRef)}>
        </wf-workflow-editor>
        <md-filled-button
            slot="primaryAction"
            @click=${this._save}>
          Add
        </md-filled-button>
        <md-text-button
            slot="secondaryAction"
            dialogAction="cancel">
          Cancel
        </md-text-button>
      </mwc-dialog>
    `;
  }

  firstUpdated() {
    this._resetWorkflow();
  }

  _resetWorkflow() {
    this.workflowEditorRef.value.workflow = this._defaultWorkflow();
  }

  _getWorkflow() {
    return this.workflowEditorRef.value.workflow;
  }

  _defaultWorkflow() {
    let wf = new pb.workflows.Workflow();
    let action = new pb.workflows.Action();
    let rAction = new pb.workflows.Action.ReplyWithCRAction();
    action.setReplyWithCrAction(rAction);
    wf.addActions(action);
    return wf;
  }

  _openingDialog() {
    this.open = true;
  }

  _closingDialog() {
    this.open = false;
  }

  _closedDialog(e) {
    if (e.detail?.action === 'cancel') this._resetWorkflow();
  }

  _save() {
    const success = this.workflowEditorRef.value.save();
    if (success) {
      this.open = false;
      this._resetWorkflow();
    }
  }
}
window.customElements.define('wf-add-dialog', WFAddDialog);
