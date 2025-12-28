import { beforeEach, describe, expect, it, vi } from 'vitest';
import FetchProxy from './FetchProxy';
import MessageIdTracker from '../messageIdTracker/MessageIdTracker';
import { ResponseModifierPort } from '../responseModifier/ResponseModifier.port';
import {
  InterceptorHandlerMock,
  matchInterceptorsMock,
  triggerEventMock,
} from '../interceptors/__mocks__/InterceptorHandler.mock';
import {
  Interceptor,
  InterceptorFilter,
} from '../interceptors/InterceptorHandler.port';
import { RequestModifierPort } from '../requestModifier/RequestModifier.port';

vi.mock('../interceptors/InterceptorHandler.adapter');

const interceptRequestMock = vi.fn<RequestModifierPort['intercept']>();
class MockRequestModifier implements RequestModifierPort {
  async intercept(
    ...args: Parameters<RequestModifierPort['intercept']>
  ): ReturnType<RequestModifierPort['intercept']> {
    return interceptRequestMock(...args);
  }
}

const interceptResponseMock = vi.fn<ResponseModifierPort['intercept']>();
class MockResponseModifier implements ResponseModifierPort {
  async intercept(
    ...args: Parameters<ResponseModifierPort['intercept']>
  ): ReturnType<ResponseModifierPort['intercept']> {
    return interceptResponseMock(...args);
  }
}

const fetchMock = vi.fn<typeof window.fetch>();

const consoleErrorMock = vi.spyOn(global.console, 'error');

const dummyResponse = new Response('{}', { status: 200 });
beforeEach(() => {
  vi.resetAllMocks();

  window.fetch = fetchMock;

  // Sensible defaults which can be overriden in each test.
  fetchMock.mockResolvedValue(dummyResponse);
  interceptResponseMock.mockResolvedValue({ wasModified: false });
  matchInterceptorsMock.mockReturnValue([]);
  consoleErrorMock.mockImplementation(() => {});
});

describe('FetchProxy', () => {
  describe('when calling fetch after enabling interception', () => {
    const dummyUrl: string = 'https://dummy.avm99963.com/';
    const dummyRequestBody = {
      1: 'request',
    };
    const dummyInit: RequestInit = {
      body: JSON.stringify(dummyRequestBody),
    };
    const dummyInitProtoJs = {
      body: '["dummy"]',
      headers: {
        'Content-Type': 'application/json+protobuf',
      },
    };

    let fetchProxy: FetchProxy;
    beforeEach(() => {
      fetchProxy = new FetchProxy(
        new MockRequestModifier(),
        new MockResponseModifier(),
        new InterceptorHandlerMock(),
        new MessageIdTracker(),
      );
      fetchProxy.enableInterception();
    });

    it('should call originalFetch with the original arguments', async () => {
      await window.fetch(dummyUrl, dummyInit);

      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock).toBeCalledWith(dummyUrl, dummyInit);
    });

    it('should remove the X-Client header before passing the request to fetch', async () => {
      await window.fetch(dummyUrl, {
        ...dummyInit,
        headers: {
          'X-Client': 'twpt',
        },
      });

      expect(fetchMock).toBeCalledTimes(1);
      expect(fetchMock.mock.calls[0][1].headers).toBeDefined();
      expect(fetchMock.mock.calls[0][1].headers).not.toHaveProperty('X-Client');
    });

    describe.each(['request', 'response'])(
      'regarding %s interceptors',
      (interceptorFilter: InterceptorFilter) => {
        describe('when no interceptors match', () => {
          it(`should not send a ${interceptorFilter} interceptor event`, async () => {
            matchInterceptorsMock.mockReturnValue([]);

            await window.fetch(dummyUrl, dummyInit);

            expect(triggerEventMock).toHaveBeenCalledTimes(0);
          });
        });

        describe('when an interceptor matches', () => {
          const dummyInterceptor: Interceptor = {
            eventName: 'dummy_event',
            urlRegex: /.*/,
            intercepts: interceptorFilter,
          };
          const dummyResponse = { 42: 'response' };
          beforeEach(() => {
            matchInterceptorsMock.mockImplementation(
              (filter: InterceptorFilter) =>
                filter === interceptorFilter ? [dummyInterceptor] : [],
            );
            fetchMock.mockResolvedValue(
              new Response(JSON.stringify(dummyResponse)),
            );
          });

          it(`should send a ${interceptorFilter} interceptor event`, async () => {
            await window.fetch(dummyUrl, dummyInit);

            expect(triggerEventMock).toHaveBeenCalledTimes(1);
            const expectedBody =
              interceptorFilter === 'request'
                ? { 1: 'request' }
                : dummyResponse;
            expect(triggerEventMock).toHaveBeenCalledWith(
              dummyInterceptor.eventName,
              expectedBody,
              expect.anything(),
            );
          });

          it(`should send a ${interceptorFilter} interceptor event with normalized protobuf when the request is application/json+protobuf`, async () => {
            fetchMock.mockResolvedValue(new Response('["dummy"]'));

            await window.fetch(dummyUrl, dummyInitProtoJs);

            expect(triggerEventMock).toHaveBeenCalledTimes(1);
            const eventBody = triggerEventMock.mock.calls[0][1];
            expect(eventBody[1]).toBe('dummy');
          });

          it(`should not reject when triggering the event fails`, async () => {
            triggerEventMock.mockImplementation(() => {
              throw new Error('dummy error');
            });

            await expect(
              window.fetch(dummyUrl, dummyInit),
            ).resolves.toBeDefined();
          });

          // TODO: add test to ensure something is logged when the previous condition happens
        });
      },
    );

    describe('regarding response modifiers', () => {
      const dummyModifiedResponse = { 99: 'modified' };
      beforeEach(() => {
        interceptResponseMock.mockResolvedValue({
          wasModified: true,
          modifiedResponse: dummyModifiedResponse,
        });
      });

      it('should pass the intercepted response to ResponseModifier', async () => {
        const dummyResponse = { 1: 'request' };
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify(dummyResponse)),
        );

        await window.fetch(dummyUrl, dummyInit);

        expect(interceptResponseMock).toHaveBeenCalledTimes(1);
        expect(interceptResponseMock).toHaveBeenCalledWith({
          url: dummyUrl,
          originalResponse: dummyResponse,
        });
      });

      it(`should pass the normalized protobuf response to ResponseModifier when the request is application/json+protobuf`, async () => {
        const dummyResponse = ['response'];
        fetchMock.mockResolvedValue(
          new Response(JSON.stringify(dummyResponse)),
        );

        await window.fetch(dummyUrl, dummyInitProtoJs);

        expect(interceptResponseMock).toHaveBeenCalledTimes(1);
        const interceptedOriginalResponse =
          interceptResponseMock.mock.calls[0][0]?.originalResponse;
        expect(interceptedOriginalResponse).toBeDefined();
        expect(interceptedOriginalResponse[1]).toBe('response');
      });

      it('should return the modified response when ResponseModifier modifies it', async () => {
        const response = await window.fetch(dummyUrl, dummyInit);
        const result = await response.json();

        expect(result).toEqual(dummyModifiedResponse);
      });

      it('should not reject when ResponseModifier throws an error', async () => {
        interceptResponseMock.mockImplementation(() => {
          throw new Error('dummy error');
        });

        await expect(window.fetch(dummyUrl, dummyInit)).resolves.toBeDefined();
      });
    });

    describe('regarding request modifiers', () => {
      const dummyModifiedBody = { 99: 'bye' };
      beforeEach(() => {
        interceptRequestMock.mockResolvedValue({
          wasModified: true,
          modifiedBody: dummyModifiedBody,
        });
      });

      it('should not call RequestModifier if the request does not have a body', async () => {
        await window.fetch(dummyUrl);

        expect(interceptRequestMock).not.toHaveBeenCalled();
      });

      it('should pass the intercepted request body to RequestModifier', async () => {
        await window.fetch(dummyUrl, dummyInit);

        expect(interceptRequestMock).toHaveBeenCalledTimes(1);
        expect(interceptRequestMock).toHaveBeenCalledWith({
          url: dummyUrl,
          originalBody: dummyRequestBody,
        });
      });

      it('should not modify the init parameter passed to fetch', async () => {
        const originalDummyInit: RequestInit = {
          body: '{"1": "originalRequest"}',
        };
        const dummyInit = structuredClone(originalDummyInit);

        await window.fetch(dummyUrl, dummyInit);

        expect(dummyInit).toEqual(originalDummyInit);
      });

      it(`should pass the normalized protobuf request body to RequestModifier when the request is application/json+protobuf`, async () => {
        await window.fetch(dummyUrl, dummyInitProtoJs);

        expect(interceptRequestMock).toHaveBeenCalledTimes(1);
        const interceptedOriginalRequest =
          interceptRequestMock.mock.calls[0][0]?.originalBody;
        expect(interceptedOriginalRequest).toBeDefined();
        expect(interceptedOriginalRequest[1]).toBe('dummy');
      });

      it('should call fetch with the modified request when RequestModifier modifies it', async () => {
        await window.fetch(dummyUrl, dummyInit);

        expect(fetchMock).toHaveBeenCalledOnce();
        const bodyPassedToFetch = fetchMock.mock.calls[0][1]?.body;
        expect(bodyPassedToFetch).toBe(JSON.stringify(dummyModifiedBody));
      });

      it('should still call fetch with the original body when ResponseModifier throws an error', async () => {
        interceptRequestMock.mockImplementation(() => {
          throw new Error('dummy error');
        });

        await expect(window.fetch(dummyUrl, dummyInit)).resolves.toBeDefined();
        expect(fetchMock).toHaveBeenCalledOnce();
        const bodyPassedToFetch = fetchMock.mock.calls[0][1]?.body;
        expect(bodyPassedToFetch).toBe(JSON.stringify(dummyRequestBody));
      });
    });

    it('should not reject when a body is not passed', async () => {
      matchInterceptorsMock.mockImplementation((filter: InterceptorFilter) => [
        {
          eventName: 'dummy_event',
          urlRegex: /.*/,
          intercepts: filter,
        },
      ]);

      await expect(window.fetch(dummyUrl)).resolves.toBeDefined();
    });
  });
});
