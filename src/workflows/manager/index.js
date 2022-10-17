import '@material/web/fab/fab.js';
import './components/List.js';
import './components/AddDialog.js';
import './components/WorkflowDialog.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../common/styles/md3.js';
import {default as WorkflowsStorage, kWorkflowsDataKey} from '../workflowsStorage.js';

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
    WorkflowsStorage.watch(workflows => {
      this._workflows = workflows;
      this.requestUpdate();
    }, /* asProtobuf = */ true);
  }

  render() {
    return html`
      <h1>Workflows</h1>
      <p>Workflows allow you to run a customized list of actions on a thread easily.</p>
      <wf-list .workflows=${this._workflows}></wf-list>
      <md-fab ${ref(this.addFabRef)}
          icon="add"
          @click=${this._showAddDialog}>
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
