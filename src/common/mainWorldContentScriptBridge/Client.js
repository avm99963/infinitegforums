export const kDefaultTimeout = 10 * 1000;  // 10 seconds

export default class MainWorldContentScriptBridgeClient {
  constructor(CSTarget, MWTarget, timeout) {
    if (!CSTarget || !MWTarget) {
      throw new Error(
          `[MWOptionsWatcherClient] CSTarget and MWTarget are compulsory.`);
    }

    this.CSTarget = CSTarget;
    this.MWTarget = MWTarget;
    this.timeout = timeout ?? kDefaultTimeout;
  }

  _sendRequestWithoutCallback(action, request, uuid) {
    if (!uuid) uuid = self.crypto.randomUUID();
    const data = {
      target: this.CSTarget,
      uuid,
      action,
      request,
    };
    window.postMessage(data, '*');
  }

  _sendRequest(action, request) {
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

      this._sendRequestWithoutCallback(action, request, uuid);
    });
  }
}
