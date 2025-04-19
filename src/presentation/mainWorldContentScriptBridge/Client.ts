import { RequestMessageData, ResponseMessageData } from './types';

export const DEFAULT_TIMEOUT = 10 * 1000; // 10 seconds

export default abstract class MainWorldContentScriptBridgeClient<
  Request,
  Response,
> {
  constructor(
    private CSTarget: string,
    private MWTarget: string,
    private timeout = DEFAULT_TIMEOUT,
  ) {
    if (!CSTarget || !MWTarget) {
      throw new Error(
        `[MWOptionsWatcherClient] CSTarget and MWTarget are compulsory.`,
      );
    }
  }

  protected _sendRequestWithoutCallback(
    action: string,
    request: Request,
    uuid: string,
  ) {
    if (!uuid) uuid = self.crypto.randomUUID();
    const data: RequestMessageData<Request> = {
      target: this.CSTarget,
      uuid,
      action,
      request,
    };
    window.postMessage(data, '*');
  }

  protected _sendRequest(action: string, request: Request) {
    return new Promise((res, rej) => {
      const uuid = self.crypto.randomUUID();

      let timeoutId: number;
      let listener = (e: MessageEvent<ResponseMessageData<Response>>) => {
        if (
          e.source !== window ||
          e.data?.target !== this.MWTarget ||
          e.data?.uuid !== uuid
        )
          return;

        window.removeEventListener('message', listener);
        clearTimeout(timeoutId);
        res(e.data?.response);
      };
      window.addEventListener('message', listener);

      timeoutId = window.setTimeout(() => {
        window.removeEventListener('message', listener);
        rej(new Error('Timed out while waiting response.'));
      }, this.timeout);

      this._sendRequestWithoutCallback(action, request, uuid);
    });
  }
}
