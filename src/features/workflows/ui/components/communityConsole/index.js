import './TwptConfirmDialog.js';
import './TwptCRImportButton.js';
import './TwptWorkflowDialog.js';
import './TwptWorkflowsMenu.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import WorkflowsStorage from '../../../core/workflowsStorage/workflowsStorage.js';

export default class TwptWorkflowsInject extends LitElement {
  static properties = {
    _workflows: {type: Object},
    _selectedWorkflowUuid: {type: String},
  };

  confirmDialogRef = createRef();
  workflowDialogRef = createRef();

  constructor() {
    super();
    this._workflows = null;
    this._selectedWorkflowUuid = null;
    this.addEventListener('twpt-workflows-update', e => {
      const workflows = e.detail?.workflows ?? [];
      WorkflowsStorage.convertRawListToProtobuf(workflows);
      this._workflows = workflows;
    });
  }

  render() {
    return html`
      <twpt-workflows-menu
          .workflows=${this._workflows}
          @select=${this._workflowSelected}>
      </twpt-workflows-menu>
      <twpt-confirm-dialog ${ref(this.confirmDialogRef)}
          .workflow=${this._selectedWorkflow}
          @confirm=${this._startWorkflow}>
      </twpt-confirm-dialog>
      <twpt-workflow-dialog ${ref(this.workflowDialogRef)}>
      </twpt-workflow-dialog>
    `;
  }

  _workflowSelected(e) {
    const uuid = e.detail?.selectedWorkflowUuid;
    if (!uuid) {
      console.error('Didn\'t get a correct uuid for the selected workflow.');
      return;
    }
    this._selectedWorkflowUuid = uuid;
    this.confirmDialogRef.value.open = true;
  }

  _startWorkflow() {
    this.workflowDialogRef.value.workflow =
        this._selectedWorkflow.cloneMessage();
    this.workflowDialogRef.value.start();
  }

  get _selectedWorkflow() {
    if (!this._workflows) return null;

    for (const w of this._workflows) {
      if (w.uuid == this._selectedWorkflowUuid) return w.proto;
    }

    return null;
  }
}
window.customElements.define('twpt-workflows-inject', TwptWorkflowsInject);
