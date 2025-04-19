import { describe, it as baseIt, expect, beforeEach, vi } from 'vitest';
import MainWorldContentScriptBridgeClient, { DEFAULT_TIMEOUT } from './Client';
import {
  ACTION_FOO,
  CS_TARGET,
  DummyAction,
  DummyActionMap,
  dummyFooRequest,
  dummyFooResponse,
  isUuid,
  MW_TARGET,
  simulateSentMessage,
} from './commonTestUtils';
import { ResponseData } from './types';

const BaseBridge = MainWorldContentScriptBridgeClient<
  DummyAction,
  DummyActionMap
>;
type BaseBridge = MainWorldContentScriptBridgeClient<
  DummyAction,
  DummyActionMap
>;

class DummyMWCSBridge extends BaseBridge {
  protected CSTarget = CS_TARGET;
  protected MWTarget = MW_TARGET;
  public timeout = DEFAULT_TIMEOUT;

  publicSendRequest(
    ...args: Parameters<BaseBridge['sendRequest']>
  ): ReturnType<BaseBridge['sendRequest']> {
    return this.sendRequest(...args);
  }

  publicSendRequestWithoutCallback(
    ...args: Parameters<BaseBridge['sendRequestWithoutCallback']>
  ): ReturnType<BaseBridge['sendRequestWithoutCallback']> {
    return this.sendRequestWithoutCallback(...args);
  }
}

const it = baseIt.extend<{
  sut: DummyMWCSBridge;
  uuid: string;
}>({
  sut: async ({}, use) => {
    await use(new DummyMWCSBridge());
  },
  uuid: 'fc40f460-6e54-434a-85dd-f9488950c9e0',
});

const postMessageMock = vi.spyOn(window, 'postMessage');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('sendRequestWithoutCallback', () => {
  it("should send the supplied action request and uuid via postMessage with targetOrigin '*' to the content script (server)", ({
    sut,
    uuid,
  }) => {
    sut.publicSendRequestWithoutCallback(ACTION_FOO, dummyFooRequest, uuid);

    expect(postMessageMock).toHaveBeenCalledOnce();
    expect(postMessageMock).toHaveBeenCalledWith(
      {
        target: CS_TARGET,
        uuid,
        action: ACTION_FOO,
        request: dummyFooRequest,
      },
      '*',
    );
  });

  it('should send a random UUID if one was not provided', ({ sut }) => {
    sut.publicSendRequestWithoutCallback(ACTION_FOO, dummyFooRequest);

    expect(postMessageMock).toHaveBeenCalledOnce();
    expect(postMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: expect.toSatisfy(isUuid),
      }),
      expect.anything(),
    );
  });
});

describe('sendRequest', () => {
  it('should send the supplied action request to the content script (server) with a random UUID', ({
    sut,
  }) => {
    sut.publicSendRequest(ACTION_FOO, dummyFooRequest);

    expect(postMessageMock).toHaveBeenCalledOnce();
    expect(postMessageMock).toHaveBeenCalledWith(
      {
        target: CS_TARGET,
        uuid: expect.toSatisfy(isUuid),
        action: ACTION_FOO,
        request: dummyFooRequest,
      },
      '*',
    );
  });

  describe('regarding the response sent by the content script (server)', () => {
    function simulateGoodServerResponse(): void {
      return simulateSentMessage(getDummyResponseData());
    }

    function getDummyResponseData(
      override?: Partial<ResponseData<typeof ACTION_FOO, DummyActionMap>>,
    ): ResponseData<typeof ACTION_FOO, DummyActionMap> {
      const goodUuid = postMessageMock.mock.calls[0]?.[0]?.uuid;
      return {
        uuid: goodUuid,
        response: dummyFooResponse,
        target: MW_TARGET,
        ...override,
      };
    }

    it('should return the response received', async ({ sut }) => {
      const result = sut.publicSendRequest(ACTION_FOO, dummyFooRequest);

      simulateGoodServerResponse();

      await expect(result).resolves.toEqual(dummyFooResponse);
    });

    it('should return the response which has the same UUID that was sent in the request', async ({
      sut,
    }) => {
      const result = sut.publicSendRequest(ACTION_FOO, dummyFooRequest);

      // Simulating another irrelevant server response.
      simulateSentMessage({
        ...getDummyResponseData({ uuid: 'irrelevant-response-uuid' }),
        response: 'bad',
      });
      // Simulating our actual server response.
      simulateSentMessage({
        ...getDummyResponseData(),
        response: 'good',
      });

      await expect(result).resolves.toEqual('good');
    });

    it('should not return a response which has another target', async ({
      sut,
    }) => {
      const result = sut.publicSendRequest(ACTION_FOO, dummyFooRequest);

      // Simulating another irrelevant server response.
      simulateSentMessage({
        ...getDummyResponseData(),
        target: 'bad-target',
        response: 'bad',
      });
      // Simulating our actual server response.
      simulateSentMessage({
        ...getDummyResponseData(),
        response: 'good',
      });

      await expect(result).resolves.toEqual('good');
    });

    it('should reject after the timeout when a response is not received', async ({
      sut,
    }) => {
      sut.timeout = 1;
      const result = sut.publicSendRequest(ACTION_FOO, dummyFooRequest);

      // The server never replies back.

      await expect(result).rejects.toEqual(expect.any(Error));
    });
  });
});
