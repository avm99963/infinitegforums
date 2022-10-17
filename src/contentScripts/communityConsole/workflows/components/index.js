import './TwptWorkflowsMenu.js';

import {css, html, LitElement} from 'lit';

import WorkflowsStorage from '../../../../workflows/workflowsStorage.js';

export default class TwptWorkflowsInject extends LitElement {
  static properties = {
    _workflows: {type: Object},
  };

  constructor() {
    super();
    this._workflows = null;
    this.addEventListener('twpt-workflows-update', e => {
      const workflows = e.detail?.workflows ?? [];
      WorkflowsStorage.convertRawListToProtobuf(workflows);
      this._workflows = workflows;
    });
  }

  render() {
    return html`
      <twpt-workflows-menu .workflows=${this._workflows}></twpt-workflows-menu>
      <twpt-workflow-dialog></twpt-workflow-dialog>
    `;
  }
}
window.customElements.define('twpt-workflows-inject', TwptWorkflowsInject);
