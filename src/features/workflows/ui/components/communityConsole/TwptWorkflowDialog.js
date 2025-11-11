import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import './TwptWorkflowProgress.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../../common/styles/md3.js';
import WorkflowRunner from '../../../core/communityConsole/runner/runner.js';

export default class TwptWorkflowDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    workflow: {type: Object},
    _runner: {type: Object, state: true},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        --mdc-dialog-content-ink-color: var(--mdc-theme-on-surface, #000);
        --mdc-dialog-z-index: 200;
      }

      .workflow-name {
        font-weight: 500;
      }
    `,
  ];

  progressRef = createRef();

  constructor() {
    super();
    this.open = false;
  }

  render() {
    return html`
      <md-dialog
          ?open=${this.open}
          @open=${this._openingDialog}
          @close=${this._closingDialog}>
        <div slot="headline">
          ${'Running ' + this.workflow?.getName?.() + '...'}
        </div>
        <div slot="content">
          <twpt-workflow-progress ${ref(this.progressRef)}
              .workflow=${this.workflow}
              currentThread=${this._runner?.currentThreadIndex}
              numThreads=${this._runner?.numThreads}
              currentAction=${this._runner?.currentActionIndex}
              status=${this._runner?.status}>
          </twpt-workflow-progress>
        </div>

        <div slot="actions">
          <md-text-button
              ?disabled=${this._runner?.status !== 'finished'}
              slot="primaryAction"
              @click=${() => this.open = false}>
            Close
          </md-text-button>
        </div>
      </md-dialog>
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
