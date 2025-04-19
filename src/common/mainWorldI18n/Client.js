import MainWorldContentScriptBridgeClient from '../../presentation/mainWorldContentScriptBridge/Client';

import {kCSTarget, kMWTarget} from './consts';

// Main World i18n client (used in scripts injected into the Main World (MW) to
// use the chrome.i18n API).
export default class MWI18nClient extends MainWorldContentScriptBridgeClient {
  constructor(timeout) {
    super(kCSTarget, kMWTarget, timeout);
  }

  async getMessage(messageName, substitutions, options) {
    return this._sendRequest(
        'getMessage', {messageName, substitutions, options});
  }

  async getUILanguage() {
    return this._sendRequest('getUILanguage', {});
  }
}
