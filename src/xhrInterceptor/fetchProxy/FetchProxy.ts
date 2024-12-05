import { InterceptorHandlerPort } from '../interceptors/InterceptorHandler.port';
import MessageIdTracker from '../MessageIdTracker';
import { ResponseModifierPort } from '../ResponseModifier.port';
import FetchProxyCallHandler from './FetchProxyCallHandler';

/**
 * Class which lets us override window.fetch to proxy the requests through our
 * internal interceptors to read/modify requests/responses.
 */
export default class FetchProxy {
  private originalFetch: typeof window.fetch;
  private isInterceptEnabled = false;

  constructor(
    private responseModifier: ResponseModifierPort,
    private interceptorHandler: InterceptorHandlerPort,
    private messageIdTracker: MessageIdTracker,
  ) {}

  enableInterception() {
    if (this.isInterceptEnabled) return;

    this.isInterceptEnabled = true;

    this.originalFetch = window.fetch;
    this.overrideFetch();
  }

  private overrideFetch() {
    window.fetch = async (...args) => {
      const fetchProxyCallhandler = new FetchProxyCallHandler(
        this.responseModifier,
        this.interceptorHandler,
        this.messageIdTracker,
        this.originalFetch,
      );
      return await fetchProxyCallhandler.proxiedFetch(...args);
    };
  }
}
