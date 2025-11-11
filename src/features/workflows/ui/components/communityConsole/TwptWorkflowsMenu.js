import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';

import consoleCommonStyles from '!!raw-loader!../../../../../static/css/common/console.css';

import {css, html, LitElement, nothing, unsafeCSS} from 'lit';
import {map} from 'lit/directives/map.js';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../../common/styles/md3.js';

export default class TwptWorkflowsMenu extends LitElement {
  static properties = {
    workflows: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`${unsafeCSS(consoleCommonStyles)}`,
    css`
      .workflows-menu {
        --md-menu-item-label-text-size: 14px;
      }

      .workflow-item {
        --md-menu-item-one-line-container-height: 48px;

        min-width: 250px;
      }

      /* Custom styles to override the common button with badge styles */
      .TWPT-btn--with-badge {
        padding-bottom: 0;
      }

      .TWPT-btn--with-badge .TWPT-badge {
        bottom: 4px;
        right: 2px;
      }
    `,
  ];

  menuRef = createRef();

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
          class="workflow-item"
          @click="${() => this._dispatchSelectEvent(w.uuid)}">
        <span slot="start">
          ${w.proto.getName()}
        </span>
      </md-menu-item>
    `);
  }

  renderMenuItems() {
    return [
      this.renderWorkflowItems(),
      html`
        <md-divider></md-divider>
        <md-menu-item
            class="workflow-item"
            @click="${() => this._openWorkflowManager()}">
          <span slot="start">
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
      <span style="position: relative;">
        <div
            id="workflows-menu-anchor"
            class="TWPT-btn--with-badge"
            @click="${this._toggleMenu}">
          <md-icon-button>
            <md-icon>more_vert</md-icon>
          </md-icon-button>
          ${this.renderBadge()}
        </div>
        <md-menu ${ref(this.menuRef)}
            class="workflows-menu"
            anchor="workflows-menu-anchor">
          ${this.renderMenuItems()}
        </md-menu>
      </span>
    `;
  }

  _dispatchSelectEvent(uuid) {
    const e = new CustomEvent('select', {
      detail: {
        selectedWorkflowUuid: uuid,
      },
    });
    this.dispatchEvent(e);
    this.menuRef.value.open = false;
  }

  _toggleMenu() {
    this.menuRef.value.open = !this.menuRef.value.open;
  }

  _openWorkflowManager() {
    const e = new Event('twpt-open-workflow-manager');
    document.dispatchEvent(e);
  }
}
window.customElements.define('twpt-workflows-menu', TwptWorkflowsMenu);
