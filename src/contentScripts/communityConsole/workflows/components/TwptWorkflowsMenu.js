import '@material/web/icon/icon.js';
import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/list/list-divider.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-button.js';
import '@material/web/menu/menu-item.js';

import consoleCommonStyles from '!!raw-loader!../../../../static/css/common/console.css';

import {css, html, LitElement, nothing, unsafeCSS} from 'lit';
import {map} from 'lit/directives/map.js';

import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';

export default class TwptWorkflowsMenu extends LitElement {
  static properties = {
    workflows: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`${unsafeCSS(consoleCommonStyles)}`,
    css`
      .workflow-item {
        padding-inline: 1em;
      }

      /* Custom styles to override the common button with badge styles */
      .TWPT-btn--with-badge {
        padding-bottom: 0!important;
      }

      .TWPT-btn--with-badge .TWPT-badge {
        bottom: 8px!important;
      }
    `,
  ];

  renderWorkflowItems() {
    if (!this.workflows) return nothing;
    if (this.workflows?.length == 0)
      return html`
        <md-menu-item disabled>
          <span class="workflow-item" slot="start">
            No workflows
          </span>
        </md-menu-item>
      `;
    return map(this.workflows, w => html`
      <md-menu-item
          @click="${() => this._showWorkflow(w.uuid)}">
        <span class="workflow-item" slot="start">
          ${w.proto.getName()}
        </span>
      </md-menu-item>
    `);
  }

  renderMenuItems() {
    return [
      this.renderWorkflowItems(),
      html`
        <md-list-divider></md-list-divider>
        <md-menu-item
            @click="${() => this._openWorkflowManager()}">
          <span class="workflow-item" slot="start">
            Manage workflows...
          </span>
        </md-menu-item>
      `,
    ];
  }

  // Based on createExtBadge() in ../../utils/common.js.
  renderBadge() {
    return html`
      <div class="TWPT-badge">
        <md-icon>repeat</md-icon>
      </div>
    `;
  }

  render() {
    return html`
      <md-menu-button>
        <div slot="button" class="TWPT-btn--with-badge">
          <md-standard-icon-button icon="more_vert"></md-standard-icon-button>
          ${this.renderBadge()}
        </div>
        <md-menu slot="menu">
          ${this.renderMenuItems()}
        </md-menu>
      </md-menu-button>
    `;
  }

  _showWorkflow(uuid) {
    console.log(`Clicked workflow ${uuid}.`);
  }

  _openWorkflowManager() {
    const e = new Event('twpt-open-workflow-manager');
    document.dispatchEvent(e);
  }
}
window.customElements.define('twpt-workflows-menu', TwptWorkflowsMenu);
