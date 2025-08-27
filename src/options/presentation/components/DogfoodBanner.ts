import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import '@material/web/icon/icon.js';
import { DISCUSS_GROUP_URL } from '../../../common/consts';

const DOGFOOD_ICON =
  'https://www.gstatic.com/images/branding/product/2x/dogfoody_64dp.png';

@customElement('dogfood-banner')
export default class DogfoodBanner extends LitElement {
  render() {
    // The full stop after the "discussion group" link shouldn't be
    // split into a new line. Please remove the following comment while
    // developing and then readd it to prevent this from happening.
    // prettier-ignore
    return html`
      <banner-card type="tertiary">
        <md-icon slot="icon" aria-hidden="false">
          <img src=${DOGFOOD_ICON} title="Dogfood" />
        </md-icon>
        <div slot="title">You're testing the new options page.</div>
        <div slot="description">
          Please leave feedback and report bugs in our
          <a
            href=${DISCUSS_GROUP_URL}
            target="_blank"
            rel="noreferrer noopener"
          >discussion group</a>.
          Thanks for testing!
        </div>
      </banner-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dogfood-banner': DogfoodBanner;
  }
}
