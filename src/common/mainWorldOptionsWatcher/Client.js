export const kDefaultTimeout = 10 * 1000;  // 10 seconds

// Main World OptionsWatcher client (used in scripts injected into the Main
// World (MW) to get the options).
export default class MWOptionsWatcherClient {
  constructor(options, CSTarget, MWTarget, timeout) {
    if (!CSTarget || !MWTarget)
      throw new Error(
          `[MWOptionsWatcherClient] CSTarget and MWTarget are compulsory.`);

    this.CSTarget = CSTarget;
    this.MWTarget = MWTarget;
    this.timeout = timeout ?? kDefaultTimeout;
    this.#setUp(options);
  }

  #setUp(options) {
    this.#sendRequestWithoutCallback('setUp', {options});
  }

  async getOption(option) {
    if (!option) return null;
    return this.#sendRequest('getOption', {option});
  }

  async getOptions(options) {
    if (!options || options?.length === 0) return [];
    return this.#sendRequest('getOptions', {options});
  }

  async isEnabled(option) {
    if (!option) return null;
    return this.#sendRequest('isEnabled', {option});
  }

  async areEnabled(options) {
    if (!options || options?.length === 0) return [];
    return this.#sendRequest('areEnabled', {options});
  }

  #sendRequestWithoutCallback(action, request, uuid) {
    if (!uuid) uuid = self.crypto.randomUUID();
    const data = {
      target: this.CSTarget,
      uuid,
      action,
      request,
    };
    window.postMessage(data, '*');
  }

  #sendRequest(action, request) {
    return new Promise((res, rej) => {
      const uuid = self.crypto.randomUUID();

      let timeoutId;
      let listener = e => {
        if (e.source !== window || e.data?.target !== this.MWTarget ||
            e.data?.uuid !== uuid)
          return;

        window.removeEventListener('message', listener);
        clearTimeout(timeoutId);
        res(e.data?.response);
      };
      window.addEventListener('message', listener);

      timeoutId = setTimeout(() => {
        window.removeEventListener('message', listener);
        rej(new Error('Timed out while waiting response.'));
      }, this.timeout);

      this.#sendRequestWithoutCallback(action, request, uuid);
    });
  }
}
