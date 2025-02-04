import { XClientHeader, XClientValue } from '../../common/api';
import {
  correctArrayKeys,
  inverseCorrectArrayKeys,
} from '../../common/protojs';
import { InterceptorHandlerPort } from '../interceptors/InterceptorHandler.port';
import MessageIdTracker from '../MessageIdTracker';
import { ResponseModifierPort } from '../ResponseModifier.port';
import FetchBody from './FetchBody';
import FetchHeaders from './FetchHeaders';
import FetchInput from './FetchInput';

export default class FetchProxyCallHandler {
  private fetchHeaders: FetchHeaders;
  private fetchBody: FetchBody;
  private fetchInput: FetchInput;

  private messageId: number;
  private url: string;
  private isArrayProto: boolean;

  constructor(
    private responseModifier: ResponseModifierPort,
    private interceptorHandler: InterceptorHandlerPort,
    private messageIdTracker: MessageIdTracker,
    private originalFetch: typeof window.fetch,
  ) {}

  async proxiedFetch(
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> {
    this.fetchHeaders = new FetchHeaders(init?.headers);
    this.fetchBody = new FetchBody(init?.body);
    this.fetchInput = new FetchInput(input);

    const shouldIgnore = this.fetchHeaders.hasValue(
      XClientHeader,
      XClientValue,
    );

    // Remove the header after being read to preserve user privacy.
    //
    // If you're a Googler/TW team member reading this, and would like us to
    // send this header to the server (e.g. for analytics purposes), please
    // feel free to contact us (the community) at twpowertools-discuss [at]
    // googlegroups.com!
    this.fetchHeaders.removeHeader(XClientHeader);

    if (shouldIgnore) {
      return await this.originalFetch.apply(global, [input, init]);
    }

    this.messageId = this.messageIdTracker.getNewId();
    this.url = this.fetchInput.getUrl();
    this.isArrayProto = this.fetchHeaders.hasValue(
      'Content-Type',
      'application/json+protobuf',
    );

    await this.attemptToSendRequestInterceptorEvent();

    const originalResponse: Response = await this.originalFetch.apply(global, [
      input,
      init,
    ]);

    const response = await this.attemptToModifyResponse(originalResponse);

    await this.attemptToSendResponseInterceptorEvent(response);

    return response;
  }

  private async attemptToSendRequestInterceptorEvent() {
    try {
      await this.sendRequestInterceptorEvent();
    } catch (e) {
      console.error(
        `[FetchProxy] An error ocurred sending a request interceptor event for ${this.url}:`,
        e,
      );
    }
  }

  private async sendRequestInterceptorEvent() {
    const interceptors = this.interceptorHandler.matchInterceptors(
      'request',
      this.url,
    );
    if (interceptors.length === 0) return;

    const rawBody = await this.fetchBody.getJSONRequestBody();
    if (!rawBody) return;

    const body = this.isArrayProto ? correctArrayKeys(rawBody) : rawBody;

    for (const interceptor of interceptors) {
      this.interceptorHandler.triggerEvent(
        interceptor.eventName,
        body,
        this.messageId,
      );
    }
  }

  private async attemptToModifyResponse(
    originalResponse: Response,
  ): Promise<Response> {
    try {
      return await this.modifyResponse(originalResponse);
    } catch (e) {
      console.error(
        `[Fetch Proxy] Couldn\'t modify the response for ${this.url}`,
        e,
      );
      return originalResponse;
    }
  }

  private async modifyResponse(originalResponse: Response) {
    const response = originalResponse.clone();
    let json = await response.json();

    if (this.isArrayProto) {
      correctArrayKeys(json);
    }

    const result = await this.responseModifier.intercept({
      originalResponse: json,
      url: this.url,
    });
    if (result.wasModified) {
      json = result.modifiedResponse;
    }

    if (this.isArrayProto) {
      inverseCorrectArrayKeys(json);
    }

    return new Response(JSON.stringify(json), {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  private async attemptToSendResponseInterceptorEvent(response: Response) {
    try {
      await this.sendResponseInterceptorEvent(response);
    } catch (e) {
      console.error(
        `[FetchProxy] An error ocurred sending a response interceptor event for ${this.url}:`,
        e,
      );
    }
  }

  private async sendResponseInterceptorEvent(response: Response) {
    const interceptors = this.interceptorHandler.matchInterceptors(
      'response',
      this.url,
    );
    if (interceptors.length === 0) return;

    const rawBody = await response.clone().json();
    if (!rawBody) return;

    const body = this.isArrayProto ? correctArrayKeys(rawBody) : rawBody;

    for (const interceptor of interceptors) {
      this.interceptorHandler.triggerEvent(
        interceptor.eventName,
        body,
        this.messageId,
      );
    }
  }
}
