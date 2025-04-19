import MainWorldContentScriptBridgeClient from '../../presentation/mainWorldContentScriptBridge/Client';

// Main World OptionsWatcher client (used in scripts injected into the Main
// World (MW) to get the options).
export default class MWOptionsWatcherClient extends
    MainWorldContentScriptBridgeClient {
  constructor(options, CSTarget, MWTarget, timeout) {
    super(CSTarget, MWTarget, timeout);
    this.#setUp(options);
  }

  #setUp(options) {
    this._sendRequestWithoutCallback('setUp', {options});
  }

  async getOption(option) {
    if (!option) return null;
    return this._sendRequest('getOption', {option});
  }

  async getOptions(options) {
    if (!options || options?.length === 0) return [];
    return this._sendRequest('getOptions', {options});
  }

  async isEnabled(option) {
    if (!option) return null;
    return this._sendRequest('isEnabled', {option});
  }

  async areEnabled(options) {
    if (!options || options?.length === 0) return [];
    return this._sendRequest('areEnabled', {options});
  }
}
