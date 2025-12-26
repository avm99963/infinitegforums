import { describe, test as baseTest, vi, expect, beforeEach } from 'vitest';
import MWI18nClient from './Client';
import MWI18nServer from './Server';
import { fixPostMessage } from '../base/tests/commonTestUtils';
import { GetMessageRequest } from './types';

const dummyLanguage = 'ca';
const dummyMessage = 'dummy message contents';
const dummyExtensionId = 'mljnbcpelaobbaklbmfbikpdjbakohpa';
// Partial mock with only the fields required by the server.
window.chrome = {
  runtime: { id: dummyExtensionId } as typeof chrome.runtime,
  i18n: {
    getMessage: (..._: unknown[]) => dummyMessage,
    getUILanguage: () => dummyLanguage,
  } as typeof chrome.i18n,
} as typeof chrome;
const getMessageMock = vi.spyOn(chrome.i18n, 'getMessage');
const getUILanguageMock = vi.spyOn(chrome.i18n, 'getUILanguage');

const test = baseTest.extend<{
  client: MWI18nClient;
  server: MWI18nServer;
}>({
  client: async ({}, use) => {
    await use(new MWI18nClient());
  },
  server: async ({}, use) => {
    const bridge = new MWI18nServer();
    bridge.register();

    await use(bridge);

    bridge.unregister();
  },
});

beforeEach(() => {
  vi.resetAllMocks();

  fixPostMessage();
});

describe('getUILanguage', () => {
  test('the client should return the UI language', async ({
    client,
    server: _,
  }) => {
    getUILanguageMock.mockReturnValue(dummyLanguage);

    const result = await client.getUILanguage();

    expect(result).toEqual(dummyLanguage);
  });
});

describe('getMessage', () => {
  const dummyRequest: GetMessageRequest = {
    messageName: 'dummy_message_name',
    substitutions: ['foo', 'bar'],
  };

  test('the client should pass the message name and substitutions to chrome.i18n.getMessage', async ({
    client,
    server: _,
  }) => {
    getMessageMock.mockReturnValue(dummyMessage);

    const result = await client.getMessage(dummyRequest);

    expect(result).toEqual(dummyMessage);
  });

  test('the client should return the message returned by the chrome.i18n API', async ({
    client,
    server: _,
  }) => {
    await client.getMessage(dummyRequest);

    expect(getMessageMock).toHaveBeenCalledExactlyOnceWith(
      dummyRequest.messageName,
      dummyRequest.substitutions,
    );
  });
});
