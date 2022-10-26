import '@material/mwc-dialog/mwc-dialog.js';
import '@material/web/button/text-button.js';

import './TwptWorkflowProgress.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import WorkflowRunner from '../runner.js';

export default class TwptWorkflowDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    workflow: {type: Object},
    _runner: {type: Object, state: true},
  };

  static styles = css`
    :host {
      --mdc-dialog-content-ink-color: var(--mdc-theme-on-surface, #000);
      --mdc-dialog-z-index: 200;
    }

    .workflow-name {
      font-weight: 500;
    }
  `;

  progressRef = createRef();

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
          heading=${'Running ' + this.workflow?.getName?.() + '...'}>
        <twpt-workflow-progress ${ref(this.progressRef)}
            .workflow=${this.workflow}
            currentThread=${this._runner?.currentThreadIndex}
            numThreads=${this._runner?.numThreads}
            currentAction=${this._runner?.currentActionIndex}
            status=${this._runner?.status}>
        </twpt-workflow-progress>

        <md-text-button
            ?disabled=${this._runner?.status !== 'finished'}
            slot="primaryAction"
            dialogAction="cancel"
            label="Close">
        </md-text-button>
      </mwc-dialog>
    `;
  }

  start() {
    this._runner =
        new WorkflowRunner(this.workflow, () => this.requestUpdate());
    this._runner.start();
    this.open = true;
  }

  _openingDialog() {
    this.open = true;
  }

  _closingDialog() {
    this.open = false;
  }
}
window.customElements.define('twpt-workflow-dialog', TwptWorkflowDialog);
