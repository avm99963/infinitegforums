import '@material/web/button/outlined-button.js';

import {html, LitElement} from 'lit';

import {SHARED_MD3_STYLES} from '../../../../common/styles/md3.js';

export default class TwptCRImportButton extends LitElement {
  static properties = {
    cannedResponseId: {type: String},
    selected: {type: Boolean},
  };

  static styles = [
    SHARED_MD3_STYLES,
  ];

  render() {
    const icon = this.selected ? 'done' : 'post_add';
    const label = this.selected ? 'Selected' : 'Select';

    return html`
      <md-outlined-button
          icon=${icon}
          label=${label}
          ?disabled=${this.selected}
          @click=${this._importCR}>
      </md-outlined-button>
    `;
  }

  _importCR() {
    window.opener?.postMessage?.(
        {
          action: 'importCannedResponse',
          cannedResponseId: this.cannedResponseId,
        },
        '*');
  }
}
window.customElements.define('twpt-cr-import-button', TwptCRImportButton);
