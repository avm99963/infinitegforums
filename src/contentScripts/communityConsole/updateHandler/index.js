import {injectScript} from '../../../common/contentScriptsUtils';
import MWI18nServer from '../../../presentation/mainWorldContentScriptBridge/i18n/Server';

import UpdateBanner from './banner/index.js';

export default class UpdateHandler {
  constructor() {
    // The extension was just updated, so we need to start everything from
    // scratch.
    const server = new MWI18nServer();
    server.register();
    injectScript(chrome.runtime.getURL('updateHandlerLitComponents.bundle.js'));
    this.updateBanner = new UpdateBanner();
  }

  handle(reason) {
    console.debug(`Handling extension update (reason: ${reason}).`);
    this.updateBanner.addBanner(reason);
  }
}
