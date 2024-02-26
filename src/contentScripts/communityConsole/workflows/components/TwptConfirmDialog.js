import '@material/web/dialog/dialog.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';

import {css, html, LitElement} from 'lit';
import {createRef, ref} from 'lit/directives/ref.js';

import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';

export default class TwptConfirmDialog extends LitElement {
  static properties = {
    open: {type: Boolean},
    workflow: {type: Object},
  };

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        --mdc-dialog-content-ink-color: var(--mdc-theme-on-surface, #000);
        --mdc-dialog-z-index: 200;
      }

      .workflow {
        font-weight: 500;
      }
    `,
  ];

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
        <div slot="content">
          Are you sure you want to run workflow
          <span class="workflow">${this.workflow?.getName?.()}</span> for all
          the selected threads?
        </div>
        <div slot="actions">
          <md-filled-button
              @click=${this._dispatchConfirmEvent}>
            Run workflow
          </md-filled-button>
          <md-text-button
              @click=${() => this.open = false}>
            Cancel
          </md-text-button>
        </div>
      </md-dialog>
    `;
  }

  _openingDialog() {
    this.open = true;
  }

  _closingDialog() {
    this.open = false;
  }

  _dispatchConfirmEvent() {
    const e = new Event('confirm');
    this.dispatchEvent(e);
    this.open = false;
  }
}
window.customElements.define('twpt-confirm-dialog', TwptConfirmDialog);
