import { describe, test as baseTest, vi, expect, beforeEach } from 'vitest';
import MWI18nClient from './Client';
import MWI18nServer from './Server';
import { fixPostMessage } from '../base/commonTestUtils';

const dummyLanguage = 'ca';
const dummyExtensionId = 'mljnbcpelaobbaklbmfbikpdjbakohpa';
// Partial mock with only the fields required by the server.
window.chrome = {
  runtime: { id: dummyExtensionId } as typeof chrome.runtime,
  i18n: {
    getUILanguage: () => dummyLanguage,
  } as typeof chrome.i18n,
} as typeof chrome;
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
