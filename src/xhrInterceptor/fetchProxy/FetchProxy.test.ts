/**
 * @jest-environment ./src/xhrInterceptor/fetchProxy/__environments__/fetchEnvironment.ts
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import FetchProxy from './FetchProxy';
import MessageIdTracker from '../MessageIdTracker';
import { ResponseModifierPort } from '../ResponseModifier.port';
import {
  InterceptorHandlerMock,
  matchInterceptorsMock,
  triggerEventMock,
} from '../interceptors/__mocks__/InterceptorHandler.mock';
import {
  Interceptor,
  InterceptorFilter,
} from '../interceptors/InterceptorHandler.port';

jest.mock('../interceptors/InterceptorHandler.adapter');

const interceptMock = jest.fn<ResponseModifierPort['intercept']>();
class MockResponseModifier implements ResponseModifierPort {
  async intercept(
    ...args: Parameters<ResponseModifierPort['intercept']>
  ): ReturnType<ResponseModifierPort['intercept']> {
    return interceptMock(...args);
  }
}

const fetchMock = jest.fn<typeof window.fetch>();

const consoleErrorMock = jest.spyOn(global.console, 'error');

const dummyResponse = new Response('{}', { status: 200 });
beforeEach(() => {
  jest.resetAllMocks();

  window.fetch = fetchMock;

  // Sensible defaults which can be overriden in each test.
  fetchMock.mockResolvedValue(dummyResponse);
  interceptMock.mockResolvedValue({ wasModified: false });
  matchInterceptorsMock.mockReturnValue([]);
  consoleErrorMock.mockImplementation(() => {});
});

describe('FetchProxy', () => {
  describe('when calling fetch after enabling interception', () => {
    const dummyUrl: string = 'https://dummy.avm99963.com/';
    const dummyInit: RequestInit = {
      body: '{"1":"request"}',
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

            expect(await window.fetch(dummyUrl, dummyInit)).resolves;
          });

          // TODO: add test to ensure something is logged when the previous condition happens
        });
      },
    );

    describe('regarding response modifiers', () => {
      const dummyModifiedResponse = { 99: 'modified' };
      beforeEach(() => {
        interceptMock.mockResolvedValue({
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

        expect(interceptMock).toHaveBeenCalledTimes(1);
        expect(interceptMock).toHaveBeenCalledWith({
          url: dummyUrl,
          originalResponse: dummyResponse,
        });
      });

      it('should return the modified response when ResponseModifier modifies it', async () => {
        const response = await window.fetch(dummyUrl, dummyInit);
        const result = await response.json();

        expect(result).toEqual(dummyModifiedResponse);
      });

      it('should not reject when ResponseModifier throws an error', async () => {
        interceptMock.mockImplementation(() => {
          throw new Error('dummy error');
        });

        expect(await window.fetch(dummyUrl, dummyInit)).resolves;
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

      expect(await window.fetch(dummyUrl)).resolves;
    });
  });
});
