import {
  ActionCodename,
  ActionMap,
  ActionRequest,
  ActionRequestData,
  ActionResponse,
  ResponseData,
} from './types';

export const DEFAULT_TIMEOUT = 10 * 1000; // 10 seconds

export default abstract class MainWorldContentScriptBridgeClient<
  A extends ActionCodename,
  M extends ActionMap<A>,
> {
  protected abstract CSTarget: string;
  protected abstract MWTarget: string;

  protected timeout = DEFAULT_TIMEOUT;

  /**
   * Sends a request and returns a Promise which resolves to the response.
   *
   * NOTE: It's important not to override the generic type T to avoid
   * type safety issues.
   *
   * @param action The codename of the action to perform.
   * @param request The payload for the action.
   * @returns A promise that resolves with the response.
   */
  protected sendRequest<T extends A>(
    action: T,
    request: ActionRequest<T, M>,
  ): Promise<ActionResponse<T, M>> {
    return new Promise((res, rej) => {
      const uuid = self.crypto.randomUUID();

      let timeoutId: number;
      const listener = (e: MessageEvent<ResponseData<T, M>>) => {
        const data = e.data;
        if (
          e.source !== window ||
          data?.target !== this.MWTarget ||
          data?.uuid !== uuid
        ) {
          return;
        }

        window.removeEventListener('message', listener);
        clearTimeout(timeoutId);
        res(data.response);
      };
      window.addEventListener('message', listener);

      timeoutId = window.setTimeout(() => {
        window.removeEventListener('message', listener);
        rej(new Error('Timed out while waiting response.'));
      }, this.timeout);

      this.sendRequestWithoutCallback(action, request, uuid);
    });
  }

  /**
   * Sends a "fire-and-forget" request that does not wait for a response.
   *
   * NOTE: It's important not to override the generic type T to avoid
   * type safety issues.
   *
   * @param action The name of the action to perform.
   * @param request The payload for the action.
   */
  protected sendRequestWithoutCallback<T extends A>(
    action: T,
    request: ActionRequest<T, M>,
    uuid?: string,
  ): void {
    if (!uuid) uuid = self.crypto.randomUUID();
    const data: ActionRequestData<T, M> = {
      target: this.CSTarget,
      uuid,
      action,
      request,
    };
    window.postMessage(data, '*');
  }
}
