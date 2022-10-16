import '@material/mwc-dialog/mwc-dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import './WorkflowEditor.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import * as pb from '../../proto/main_pb.js';

export default class WFWorkflowDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    uuid: {type: String},
    workflow: {type: Object},
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
    this.workflow = new pb.workflows.Workflow();
  }

  render() {
    return html`
      <mwc-dialog
          ?open=${this.open}
          @opening=${this._openingDialog}
          @closing=${this._closingDialog}>
        <wf-workflow-editor ${ref(this.workflowEditorRef)}
            .workflow=${this.workflow}>
        </wf-workflow-editor>
        <md-filled-button
            slot="primaryAction"
            label="Save"
            @click=${this._save}>
        </md-filled-button>
        <md-text-button
            slot="secondaryAction"
            dialogAction="cancel"
            label="Cancel">
        </md-text-button>
      </mwc-dialog>
    `;
  }

  _openingDialog() {
    this.open = true;
  }

  _closingDialog() {
    this.open = false;
  }

  _save() {
    const success = this.workflowEditorRef.value.save(this.uuid);
    if (success) this.open = false;
  }
}
window.customElements.define('wf-workflow-dialog', WFWorkflowDialog);
