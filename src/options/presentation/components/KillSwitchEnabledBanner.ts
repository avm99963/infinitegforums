import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { DISCUSS_GROUP_URL } from '../../../common/consts';

import '@material/web/icon/icon.js';
import './BannerCard';

@customElement('kill-switch-enabled-banner')
export default class KillSwitchEnabledBanner extends I18nLitElement {
  static styles = [
    css`
      banner {
        margin-bottom: 8px;

        a {
          color: var(--md-sys-color-primary);
        }
      }
    `,
  ];

  render() {
    return html`
      <banner-card type="error">
        <md-icon slot="icon">error</md-icon>
        <div slot="title">Kill switch active</div>
        <div slot="description">
          One or more features have been disabled remotely for everyone.
          <a
            href=${DISCUSS_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn why in our discussion group.
          </a>
        </div>
      </banner-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kill-switch-enabled-banner': KillSwitchEnabledBanner;
  }
}
