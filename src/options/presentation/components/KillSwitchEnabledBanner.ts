import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nLitElement } from '../../../common/litI18nUtils';
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles';

import '@material/web/labs/card/filled-card.js';
import '@material/web/icon/icon.js';
import { DISCUSS_GROUP_URL } from '../../../common/consts';

@customElement('kill-switch-enabled-banner')
export default class KillSwitchEnabledBanner extends I18nLitElement {
  static styles = [
    typescaleStyles,
    css`
      md-filled-card {
        --md-filled-card-container-color: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
        padding: 20px 24px;
        margin-bottom: 8px;

        .title {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        a {
          color: var(--md-sys-color-primary);
        }
      }
    `,
  ];

  render() {
    return html`
      <md-filled-card aria-labelledby="kill-switch-enabled-title">
        <div class="title md-typescale-title-large">
          <md-icon>error</md-icon>
          Remotely disabled features
        </div>
        <div class="description md-typescale-body-medium">
          One or more features have been disabled remotely for everyone.
          <a
            href=${DISCUSS_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn why in our discussion group.
          </a>
        </div>
      </md-filled-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'kill-switch-enabled-banner': KillSwitchEnabledBanner;
  }
}
