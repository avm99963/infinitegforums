import '@material/web/list/list.js';
import '@material/web/list/list-item.js';
import '@material/web/iconbutton/standard-icon-button.js';

import {css, html, LitElement, nothing} from 'lit';
import {map} from 'lit/directives/map.js';

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

  renderListItems() {
    return map(this.workflows, w => html`
      <md-list-item
          headline=${w.proto?.getName?.()}
          @click=${() => this._show(w.uuid)}>
        <div slot="end" class="end">
          <md-standard-icon-button
              icon="edit"
              @click=${e => this._showEdit(w.uuid, e)}>
          </md-standard-icon-button>
          <md-standard-icon-button
              icon="delete"
              @click=${e => this._showDelete(w.uuid, e)}>
          </md-standard-icon-button>
        </div>
      </md-list-item>
    `);
  }

  render() {
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

  _show(uuid) {}

  _showEdit(uuid, e) {
    e.stopPropagation();
  }

  _showDelete(uuid, e) {
    e.stopPropagation();
  }
}
window.customElements.define('wf-list', WFList);
