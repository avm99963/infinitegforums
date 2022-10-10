import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/menu/menu-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

import {css, html, LitElement} from 'lit';
import {map} from 'lit/directives/map.js';
import {range} from 'lit/directives/range.js';

export default class TwptWorkflowsMenu extends LitElement {
  static styles = css`
    .workflow-item {
      padding-inline: 1em;
    }
  `;

  renderMenuItems() {
    return map(range(8), i => html`
      <md-menu-item @click="${this._showWorkflow}" data-workflow-id="${i}"><span class="workflow-item" slot="start">Workflow ${i}</span></md-menu-item>
    `);
  }

  render() {
    // The button is based in the button created in the
    // addButtonToThreadListActions function in file ../../utils/common.js.
    return html`
      <md-menu-button>
        <md-standard-icon-button slot="button" icon="more_vert"></md-standard-icon-button>
        <md-menu slot="menu">
          ${this.renderMenuItems()}
        </md-menu>
      </md-menu-button>
    `;
  }

  _showWorkflow(e) {
    console.log(`Clicked workflow ${e.target.getAttribute('data-workflow-id')}.`);
  }
}
window.customElements.define('twpt-workflows-menu', TwptWorkflowsMenu);
