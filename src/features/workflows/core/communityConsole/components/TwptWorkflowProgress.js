import '@material/mwc-dialog/mwc-dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';

import '../../manager/components/ActionEditor.js';

import {css, html, LitElement} from 'lit';
import {map} from 'lit/directives/map.js';

import {SHARED_MD3_STYLES} from '../../../../../common/styles/md3.js';

export default class TwptWorkflowProgress extends LitElement {
  static properties = {
    workflow: {type: Object},
    currentThread: {type: Number},
    numThreads: {type: Number},
    currentAction: {type: Number},
    status: {type: String},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
      .progressbar-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ];

  renderThreadProgress() {
    // @TODO: Improve this UI when the actions section is complete
    return html`
      <div class="progressbar-container">
        <progress value=${this.currentThread + 1} max=${
        this.numThreads}></progress>
        <span>Thread ${this.currentThread + 1}/${this.numThreads}</span>
      </div>
      <p style="color: gray;">(Debug information) Status: ${this.status}</p>
    `;
  }

  renderActions() {
    const actions = this.workflow?.getActionsList?.() ?? [];
    return map(actions, (action, i) => {
      let status;
      if (i > this.currentAction)
        status = 'idle';
      else if (i == this.currentAction && this.status == 'running')
        status = 'running';
      else if (i == this.currentAction && this.status == 'error')
        status = 'error';
      else
        status = 'done';

      return html`
        <wf-action-editor
            .action=${action}
            readOnly
            step=${i + 1}
            status=${status}>
        </wf-action-editor>
      `;
    });
  }

  render() {
    return [
      this.renderThreadProgress(),
      this.renderActions(),
    ];
  }
}
window.customElements.define('twpt-workflow-progress', TwptWorkflowProgress);
