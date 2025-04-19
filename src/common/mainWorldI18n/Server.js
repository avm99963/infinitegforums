import MainWorldContentScriptBridgeServer from '../../presentation/mainWorldContentScriptBridge/Server';

import {kCSTarget, kMWTarget} from './consts';

// Main World i18n server (used in content scripts to be able to serve the
// chrome.i18n API to Main World (MW) scripts).
export default class MWI18nServer extends MainWorldContentScriptBridgeServer {
  constructor() {
    super(kCSTarget, kMWTarget);
    this.setUpHandler(this.handleMessage);
  }

  handleMessage(uuid, action, request) {
    switch (action) {
      case 'getMessage':
        var response = chrome.i18n.getMessage(
            request.messageName, request.substitutions, request.options);
        this._respond(uuid, response);
        return;

      case 'getUILanguage':
        this._respond(uuid, chrome.i18n.getUILanguage());
        return;

      default:
        console.error(`[MWI18nServer] Invalid action received (${action})`);
    }
  }
}
