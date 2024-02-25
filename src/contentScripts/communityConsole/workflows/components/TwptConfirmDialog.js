import '@material/mwc-dialog/mwc-dialog.js';
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
      <mwc-dialog
          ?open=${this.open}
          @opening=${this._openingDialog}
          @closing=${this._closingDialog}>
        <p>
          Are you sure you want to run workflow
          <span class="workflow">${this.workflow?.getName?.()}</span> for all
          the selected threads?
        </p>
        <md-filled-button
            slot="primaryAction"
            @click=${this._dispatchConfirmEvent}>
          Run workflow
        </md-filled-button>
        <md-text-button
            slot="secondaryAction"
            dialogAction="cancel">
          Cancel
        </md-text-button>
      </mwc-dialog>
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
