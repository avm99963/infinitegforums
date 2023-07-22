import {TWPT_UPDATE_BANNER_TAG} from './components/consts.js';

export default class UpdateBanner {
  addBanner(reason) {
    const main = document.querySelector('.scrollable-content > main');
    if (main === null) {
      console.error(`[updateHandlerBanner] Couldn't find main element.`);
      return;
    }
    const banner = document.createElement(TWPT_UPDATE_BANNER_TAG);
    if (reason === 'install') banner.setAttribute('isinstall', '');
    main.prepend(banner);
  }
}
