import '@material/web/chips/assist-chip.js';
import '@material/web/chips/chip-set.js';
import '@material/web/icon/icon.js';
import { customElement, property } from 'lit/decorators.js';
import { I18nLitElement } from '../../../../common/litI18nUtils';
import { css, html } from 'lit';
import { SHARED_MD3_STYLES } from '../../../../common/styles/md3';

@customElement('bulk-report-controls')
export default class BulkReportControls extends I18nLitElement {
  @property({ type: String })
  accessor messageId: string;

  static styles = [
    SHARED_MD3_STYLES,
    css`
      :host {
        display: flex;
        align-items: center;
        margin-left: auto;
      }

      md-assist-chip {
        --md-assist-chip-leading-icon-color: var(--md-sys-color-error);
        --md-assist-chip-focus-leading-icon-color: var(--md-sys-color-error);
        --md-assist-chip-hover-leading-icon-color: var(--md-sys-color-error);
        --md-assist-chip-pressed-leading-icon-color: var(--md-sys-color-error);
      }
    `,
  ];

  // TODO(https://iavm.xyz/b/twpowertools/192): Make the buttons work.
  render() {
    return html`
      <md-chip-set aria-label="Report actions">
        <md-assist-chip>
          <md-icon slot="icon">block</md-icon>
          Mark as off-topic
        </md-assist-chip>
        <md-assist-chip>
          <md-icon slot="icon">error</md-icon>
          Mark as abuse
        </md-assist-chip>
      </md-chip-set>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'bulk-report-controls': BulkReportControls;
  }
}
