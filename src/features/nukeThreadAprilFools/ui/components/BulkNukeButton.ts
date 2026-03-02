import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import { SHARED_MD3_STYLES } from '@/common/styles/md3';

@customElement('twpt-bulk-nuke-button')
export default class BulkNukeButton extends LitElement {
  static styles = [
    SHARED_MD3_STYLES,
    css`
      md-icon-button {
        --md-icon-button-icon-color: var(--TWPT-subtle-button-background);
      }
    `,
  ];

  render() {
    return html`
      <md-icon-button>
        <md-icon>bomb</md-icon>
      </md-icon-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-bulk-nuke-button': BulkNukeButton;
  }
}
