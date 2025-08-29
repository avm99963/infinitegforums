import { msg } from '@lit/localize';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { DISCUSS_GROUP_URL } from '../../../common/consts';
import { I18nLitElement } from '../../../common/litI18nUtils';

import '@material/web/icon/icon.js';

const DOGFOOD_ICON =
  'https://www.gstatic.com/images/branding/product/2x/dogfoody_64dp.png';

@customElement('dogfood-banner')
export default class DogfoodBanner extends I18nLitElement {
  render() {
    const title = msg("You're testing the new options page.");
    // prettier-ignore
    const description = msg(html`Please leave feedback and report bugs in our <a href=${DISCUSS_GROUP_URL} target="_blank" rel="noreferrer noopener">discussion group</a>. Thanks for testing!`);

    return html`
      <banner-card type="tertiary">
        <md-icon slot="icon" aria-hidden="false">
          <img src=${DOGFOOD_ICON} />
        </md-icon>
        <div slot="title">${title}</div>
        <div slot="description">${description}</div>
      </banner-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dogfood-banner': DogfoodBanner;
  }
}
