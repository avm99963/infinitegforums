import {
  ActionCodename,
  ActionMap,
  ActionRequest,
  ActionResponse,
  RequestData,
} from './types';

export default abstract class MainWorldContentScriptBridgeServer<
  A extends ActionCodename,
  M extends ActionMap<A>,
> {
  protected abstract CSTarget: string;
  protected abstract MWTarget: string;
  protected abstract handlers: Handlers<A, M>;

  private isSetUp = false;

  private eventHandler:
    | MainWorldContentScriptBridgeServer<A, M>['handleMessageInternal']
    | undefined;

  register() {
    if (!this.isSetUp) {
      this.isSetUp = true;
      this.eventHandler = this.handleMessageInternal.bind(this);
      window.addEventListener('message', this.eventHandler);
    }
  }

  unregister() {
    if (this.isSetUp) {
      const eventHandler = this.eventHandler;
      this.isSetUp = false;
      this.eventHandler = undefined;
      window.removeEventListener('message', eventHandler);
    }
  }

  private async handleMessageInternal(e: MessageEvent<RequestData<A, M>>) {
    const uuid = e.data?.uuid;
    if (e.source !== window || e.data?.target !== this.CSTarget || !uuid) {
      console.debug(
        '[MainWorldContentScriptBridgeServer] Ignoring message because it is not destined for this server.',
      );
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

    const handler = this.handlers[action];
    if (handler === undefined) {
      console.error(
        `[MainWorldContentScriptBridgeServer] Invalid action received: ${action}. No handler was found for it.`,
      );
      return;
    }

    try {
      const response = await handler(request);
      this.respond(uuid, response);
    } catch (e) {
      console.error(
        `[MainWorldContentScriptBridgeServer] Error executing handler for action: ${action}.`,
        e,
      );
      // TODO(https://iavm.xyz/b/twpowertools/253): let the client know of the
      // error, in case it wants to deal with it in some way.
    }
  }

  /**
   * Sends a response back to the client.
   *
   * NOTE: This function should at most be called once for each handled message.
   */
  private respond(uuid: string, response: ActionResponse<A, M>) {
    const data = {
      target: this.MWTarget,
      uuid,
      response,
    };
    window.postMessage(data, window.origin);
  }
}

export type Handlers<A extends ActionCodename, M extends ActionMap<A>> = {
  [T in A]: Handler<T, M>;
};

export type Handler<A extends ActionCodename, M extends ActionMap<A>> = (
  request: ActionRequest<A, M>,
) => ActionResponse<A, M> | Promise<ActionResponse<A, M>>;
