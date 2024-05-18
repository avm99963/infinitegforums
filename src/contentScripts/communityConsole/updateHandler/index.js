import {injectScript} from '../../../common/contentScriptsUtils.js';
import MWI18nServer from '../../../common/mainWorldI18n/Server.js';

import UpdateBanner from './banner/index.js';

export default class UpdateHandler {
  constructor() {
    // The extension was just updated, so we need to start everything from
    // scratch.
    new MWI18nServer();
    injectScript(chrome.runtime.getURL('updateHandlerLitComponents.bundle.js'));
    this.updateBanner = new UpdateBanner();
  }

  handle(reason) {
    console.debug(`Handling extension update (reason: ${reason}).`);
    this.updateBanner.addBanner(reason);
  }
}
