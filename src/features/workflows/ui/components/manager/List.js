import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import './WorkflowDialog.js';

import {css, html, LitElement, nothing} from 'lit';
import {map} from 'lit/directives/map.js';
import {createRef, ref} from 'lit/directives/ref.js';

import WorkflowsStorage from '../../../core/workflowsStorage/workflowsStorage.js';

export default class WFList extends LitElement {
  static properties = {
    workflows: {type: Object},
  };

  static styles = css`
    .noworkflows {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 32px 0;
    }

    .noworkflows--image {
      margin-bottom: 16px;
      max-width: 500px;
    }

    .noworkflows--helper {
      color: #555;
    }
  `;

  dialogRef = createRef();

  renderListItems() {
    return map(this.workflows, (w, index) => html`
      <md-list-item
          type="button"
          @click=${() => this._show(w)}>
        <div slot="headline">${w.proto?.getName?.()}</div>
        <div slot="end" class="end">
          <md-icon-button
              aria-label="Move up"
              ?soft-disabled=${index === 0}
              @click=${e => this._moveUp(w.uuid, e)}>
            <md-icon>arrow_upward</md-icon>
          </md-icon-button>
          <md-icon-button
              aria-label="Move down"
              ?soft-disabled=${index === this.workflows.length - 1}
              @click=${e => this._moveDown(w.uuid, e)}>
            <md-icon>arrow_downward</md-icon>
          </md-icon-button>
          <md-icon-button
              aria-label="Delete"
              @click=${e => this._showDelete(w.uuid, e)}>
            <md-icon>delete</md-icon>
          </md-icon-button>
        </div>
      </md-list-item>
    `);
  }

  renderList() {
    if (!this.workflows) return nothing;
    if (this.workflows?.length === 0)
      return html`
      <div class="noworkflows">
        <img class="noworkflows--image" src="/img/undraw_insert.svg">
        <span class="noworkflows--helper">You haven't created any workflow yet! Create one by clicking the button in the bottom-right corner.</span>
      </div>
    `;

    return html`
      <md-list>
        ${this.renderListItems()}
      </md-list>
    `;
  }

  renderDialog() {
    return html`
      <wf-workflow-dialog ${ref(this.dialogRef)}></wf-workflow-dialog>
    `;
  }

  render() {
    return [
      this.renderList(),
      this.renderDialog(),
    ];
  }

  _show(fullWorkflow) {
    this.dialogRef.value.uuid = fullWorkflow.uuid;
    this.dialogRef.value.workflow = fullWorkflow.proto.cloneMessage();
    this.dialogRef.value.open = true;
  }

  _moveUp(uuid, e) {
    e.stopPropagation();
    WorkflowsStorage.moveUp(uuid);
  }

  _moveDown(uuid, e) {
    e.stopPropagation();
    WorkflowsStorage.moveDown(uuid);
  }

  _showDelete(uuid, e) {
    e.stopPropagation();
    const proceed = window.confirm(
        'Do you really want to remove this workflow? This action is irreversible.');
    if (proceed) WorkflowsStorage.remove(uuid);
  }
}
window.customElements.define('wf-list', WFList);
