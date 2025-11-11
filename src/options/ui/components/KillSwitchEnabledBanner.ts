import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { I18nLitElement } from '../../../ui/i18n/i18nLitElement';
import { DISCUSS_GROUP_URL } from '../../../common/consts';
import { msg } from '@lit/localize';

import '@material/web/icon/icon.js';
import './BannerCard';

@customElement('kill-switch-enabled-banner')
export default class KillSwitchEnabledBanner extends I18nLitElement {
  static styles = [
    css`
      a {
        color: var(--md-sys-color-primary);
      }
    `,
  ];

  render() {
    return html`
      <banner-card type="error">
        <md-icon slot="icon">error</md-icon>
        <div slot="title">
          ${msg('Kill switch active', {
            desc: 'Title of the banner which lets users know that a feature was remotely disabled in the options page.',
          })}
        </div>
        <div slot="description">
          ${msg(
            html`
              One or more features have been disabled remotely for everyone.
              <a
                href=${DISCUSS_GROUP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn why in our discussion group.
              </a>
            `,
            {
              desc: 'Content of the banner which lets users know that a feature was remotely disabled in the options page.',
            },
          )}
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
