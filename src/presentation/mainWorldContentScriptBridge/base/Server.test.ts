import { it as baseIt, beforeEach, describe, expect, vi } from 'vitest';
import {
  ACTION_BAR,
  ACTION_FOO,
  CS_TARGET,
  DummyAction,
  DummyActionMap,
  dummyFooRequest,
  dummyFooResponse,
  MW_TARGET,
  simulateSentMessage,
} from './commonTestUtils';
import MainWorldContentScriptBridgeServer, {
  Handlers as BaseHandlers,
} from './Server';
import { RequestData } from './types';

const BaseBridge = MainWorldContentScriptBridgeServer<
  DummyAction,
  DummyActionMap
>;
type BaseBridge = MainWorldContentScriptBridgeServer<
  DummyAction,
  DummyActionMap
>;

type Handlers = BaseHandlers<DummyAction, DummyActionMap>;

const fooActionHandlerMock = vi.fn<Handlers[typeof ACTION_FOO]>();
const barActionHandlerMock = vi.fn<Handlers[typeof ACTION_BAR]>();

class DummyMWCSBridge extends BaseBridge {
  protected CSTarget = CS_TARGET;
  protected MWTarget = MW_TARGET;

  protected handlers: Handlers = {
    [ACTION_FOO]: fooActionHandlerMock,
    [ACTION_BAR]: barActionHandlerMock,
  };
}

const it = baseIt.extend<{
  sut: DummyMWCSBridge;
}>({
  sut: async ({}, use) => {
    const bridge = new DummyMWCSBridge();
    bridge.register();

    await use(bridge);

    bridge.unregister();
  },
});

const postMessageMock = vi.spyOn(window, 'postMessage');
const consoleDebugMock = vi.spyOn(window.console, 'debug');
const consoleErrorMock = vi.spyOn(window.console, 'error');

const dummyExtensionId = 'mljnbcpelaobbaklbmfbikpdjbakohpa';
// Partial mock with only the fields required by the server.
window.chrome = {
  runtime: {
    id: dummyExtensionId,
  } as typeof chrome.runtime,
} as typeof chrome;
const chromeRuntimeIdMock = vi.spyOn(chrome.runtime, 'id', 'get');

const dummyUuid = 'fc40f460-6e54-434a-85dd-f9488950c9e1';
const dummyFooRequestData: RequestData<DummyAction, DummyActionMap> = {
  uuid: dummyUuid,
  action: ACTION_FOO,
  request: dummyFooRequest,
  target: CS_TARGET,
};

beforeEach(() => {
  vi.resetAllMocks();

  // Sensible defaults for the mock implementations
  chromeRuntimeIdMock.mockReturnValue(dummyExtensionId);
  // This prevents postMessage calls from generating messages which are
  // reconsumed by the server. We will simulate these scenarios ourselves.
  postMessageMock.mockImplementation(() => {});
});

describe('happy path', () => {
  beforeEach(() => {
    fooActionHandlerMock.mockReturnValue(dummyFooResponse);
  });

  it('should call the corresponding action handler once', async ({
    sut: _,
  }) => {
    simulateSentMessage(dummyFooRequestData);

    await vi.waitFor(() => expect(fooActionHandlerMock).toHaveBeenCalledOnce());
  });

  it('should post a message with the response given by the handler', async ({
    sut: _,
  }) => {
    simulateSentMessage(dummyFooRequestData);

    // We simulate the client message by directly firing an event on window,
    // instead of calling postMessage, to be able to initialize MessageEvent
    // closer to reality (in specific, the source field).
    //
    // This is why postMessageMock should only be called once: by the server for
    // responding.
    await vi.waitFor(() => expect(postMessageMock).toHaveBeenCalledOnce());
    expect(postMessageMock.mock.calls[0]).toEqual([
      expect.objectContaining({
        target: MW_TARGET,
        uuid: dummyUuid,
        response: dummyFooResponse,
      }),
      window.origin,
    ]);
  });
});

describe('cases when the server should ignore messages (log a debug message and not call postMessage)', () => {
  interface TestConfig {
    testName: string;
    requestData: RequestData<DummyAction, DummyActionMap>;
    messageSource: MessageEventSource | undefined;
    chromeRuntimeId: string | undefined;
  }

  const goodConfig: Omit<TestConfig, 'testName'> = {
    requestData: dummyFooRequestData,
    messageSource: window,
    chromeRuntimeId: dummyExtensionId,
  };
  it.for<TestConfig>([
    {
      testName: 'when the extension is dead',
      ...goodConfig,
      chromeRuntimeId: undefined,
    },
    {
      testName: 'when source is not the current window',
      ...goodConfig,
      messageSource: null,
    },
    {
      testName: 'when target is not the content script (server)',
      ...goodConfig,
      requestData: {
        ...dummyFooRequestData,
        target: MW_TARGET,
      },
    },
  ])(
    '$testName',
    async ({ requestData, messageSource, chromeRuntimeId }, { sut: _ }) => {
      chromeRuntimeIdMock.mockReturnValue(chromeRuntimeId);

      simulateSentMessage(requestData, messageSource);

      await vi.waitFor(() => expect(consoleDebugMock).toHaveBeenCalledOnce());
      expect(postMessageMock).toHaveBeenCalledTimes(0);
    },
  );
});

it("should log an error message and not call postMessage when the requested action doesn't have a handler", async ({
  sut: _,
}) => {
  simulateSentMessage({
    uuid: dummyUuid,
    action: 'non-existent-action' as typeof ACTION_FOO,
    request: dummyFooRequest,
    target: CS_TARGET,
  });

  await vi.waitFor(() => expect(consoleErrorMock).toHaveBeenCalledOnce());
  expect(postMessageMock).toHaveBeenCalledTimes(0);
});

// TODO(https://iavm.xyz/b/twpowertools/253): make the server pass the error the
// client instead.
it('should log an error message and not call postMessage when the requested action throws an error', async ({
  sut: _,
}) => {
  fooActionHandlerMock.mockImplementation(() => {
    throw new Error('dummy error');
  });

  simulateSentMessage(dummyFooRequestData);

  await vi.waitFor(() => expect(consoleErrorMock).toHaveBeenCalledOnce());
  expect(postMessageMock).toHaveBeenCalledTimes(0);
});
