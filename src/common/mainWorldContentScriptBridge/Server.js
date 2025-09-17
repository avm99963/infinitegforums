export default class MainWorldContentScriptBridgeServer {
  constructor(CSTarget, MWTarget) {
    if (!CSTarget || !MWTarget) {
      throw new Error(
          `[MWOptionsWatcherServer] CSTarget and MWTarget are compulsory.`);
    }

    this.CSTarget = CSTarget;
    this.MWTarget = MWTarget;
    this.handler = () => {};
  }

  // Handler should be an action of the form (uuid, action, request) => {...}.
  setUpHandler(handler) {
    this.handler = handler;
    window.addEventListener('message', e => this.#handleMessage(e));
  }

  #handleMessage(e) {
    const uuid = e.data?.uuid;
    if (e.source !== window || e.data?.target !== this.CSTarget || !uuid)
      return;

    // If chrome.runtime.id is undefined, then this content script belongs to a
    // dead extension (see https://stackoverflow.com/a/69603416).
    if (typeof chrome.runtime.id === 'undefined') {
      console.debug(
          '[MainWorldContentScriptBridgeServer] Not handling message because this is a dead server.');
      return;
    }

    const action = e.data?.action;
    const request = e.data?.request;
    return this.handler(uuid, action, request);
  }

  _respond(uuid, response) {
    const data = {
      target: this.MWTarget,
      uuid,
      response,
    };
    window.postMessage(data, window.origin);
  }
}
