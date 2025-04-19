import { RequestMessageData } from './types';

export default abstract class MainWorldContentScriptBridgeServer<
  Request,
  Response,
> {
  abstract handler: Handler<Request>;

  constructor(
    private CSTarget: string,
    private MWTarget: string,
  ) {
    if (!CSTarget || !MWTarget) {
      throw new Error(
        `[MWOptionsWatcherServer] CSTarget and MWTarget are compulsory.`,
      );
    }
  }

  // Handler should be an action of the form (uuid, action, request) => {...}.
  protected setUpHandler(handler: Handler<Request>) {
    this.handler = handler;
    window.addEventListener('message', (e) => this.handleMessageInternal(e));
  }

  private handleMessageInternal(e: MessageEvent<RequestMessageData<Request>>) {
    const uuid = e.data?.uuid;
    if (e.source !== window || e.data?.target !== this.CSTarget || !uuid) {
      return;
    }

    // If chrome.runtime.id is undefined, then this content script belongs to a
    // dead extension (see https://stackoverflow.com/a/69603416).
    if (typeof chrome.runtime.id === 'undefined') {
      console.debug(
        '[MainWorldContentScriptBridgeServer] Not handling message because this is a dead server.',
      );
      return;
    }

    const action = e.data?.action;
    const request = e.data?.request;
    return this.handler(uuid, action, request);
  }

  protected respond(uuid: string, response: Response) {
    const data = {
      target: this.MWTarget,
      uuid,
      response,
    };
    window.postMessage(data, window.origin);
  }
}

export type Handler<Request> = (
  uuid: string,
  action: string,
  request: Request,
) => void;
