import MainWorldContentScriptBridgeClient from '../mainWorldContentScriptBridge/Client.js';

import {kCSTarget, kMWTarget} from './consts.js';

// Main World i18n client (used in scripts injected into the Main World (MW) to
// use the chrome.i18n API).
export default class MWI18nClient extends MainWorldContentScriptBridgeClient {
  constructor(timeout) {
    super(kCSTarget, kMWTarget, timeout);
  }

  async getUILanguage() {
    return this._sendRequest('getUILanguage', {});
  }
}
