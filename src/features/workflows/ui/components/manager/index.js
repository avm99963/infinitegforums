import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
import './List.js';
import './AddDialog.js';
import './WorkflowDialog.js';
import './Menu';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../../common/styles/md3.js';
import {default as WorkflowsStorage} from '../../../core/workflowsStorage/workflowsStorage.js';

export default class WFApp extends LitElement {
  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI',
            Helvetica, Arial, sans-serif, 'Apple Color Emoji',
            'Segoe UI Emoji', 'Segoe UI Symbol'!important;

        display: block;
        max-width: 1024px;
        margin: auto;
        position: relative;
      }

      wf-menu {
        position: absolute;
        top: 0.33em;
        right: 0.5em;
      }

      md-fab {
        position: fixed;
        bottom: 2em;
        right: 2em;
      }
    `,
  ];

  addFabRef = createRef();
  addDialog = createRef();

  constructor() {
    super();
    this._workflows = undefined;
    WorkflowsStorage.watch(rawWorkflows => {
      this._workflows = WorkflowsStorage.convertRawListToProtobuf(rawWorkflows);
      this.requestUpdate();
    });
  }

  render() {
    return html`
      <h1>Workflows</h1>
      <wf-menu></wf-menu>
      <p>Workflows allow you to run a customized list of actions on a thread easily.</p>
      <wf-list .workflows=${this._workflows}></wf-list>
      <md-fab ${ref(this.addFabRef)}
          @click=${this._showAddDialog}>
        <md-icon slot="icon">add</md-icon>
      </md-fab>
      <wf-add-dialog ${ref(this.addDialog)}>
      </wf-add-dialog>
    `;
  }

  _showAddDialog() {
    this.addDialog.value.open = true;
  }
}
window.customElements.define('wf-app', WFApp);
