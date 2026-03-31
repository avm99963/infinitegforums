import { customElement } from 'lit/decorators.js';
import { html } from 'lit';
import { I18nLitElement } from '@/ui/i18n/i18nLitElement';
import { SHARED_MD3_STYLES } from '@/common/styles/md3';

import '@material/web/checkbox/checkbox.js';
import '@/ui/components/badge/Badge';

@customElement('twpt-soft-lock-settings')
export default class TWPTSoftLockSettings extends I18nLitElement {
  static styles = [SHARED_MD3_STYLES];

  render() {
    return html`
      <span title="To be implemented...">[Soft lock settings]</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'twpt-soft-lock-settings': TWPTSoftLockSettings;
  }
}
