import { describe, it, expect, beforeEach, vi } from 'vitest';
import './storageArea';

const dummyItems = { foo: 'foo', bar: 'bar' };

describe('when passing a callback', () => {
  beforeEach(async () => {
    await chrome.storage.sync.clear();
    vi.clearAllMocks();
  });

  it('should save settings to sync storage', () => {
    chrome.storage.sync.set(dummyItems, () => {});

    expect(chrome.storage.sync.set).toHaveBeenCalledWith(
      dummyItems,
      expect.any(Function),
    );
  });

  it('should retrieve the setting if it was previously set', () => {
    chrome.storage.sync.set(dummyItems);

    const callback = vi.fn();
    chrome.storage.sync.get('foo', callback);

    expect(callback).toHaveBeenCalledWith({ foo: 'foo' });
  });
});

describe('when expecting a promise', () => {
  beforeEach(async () => {
    await chrome.storage.sync.clear();
    vi.clearAllMocks();
  });

  it('should return a promise when setting data', async () => {
    await chrome.storage.sync.set(dummyItems);

    expect(chrome.storage.sync.set).toHaveBeenCalledWith(dummyItems);
  });

  describe('get method', () => {
    beforeEach(async () => {
      await chrome.storage.sync.set(dummyItems);
    });

    it('should retrieve data as a promise', async () => {
      const result = await chrome.storage.sync.get('foo');

      expect(result).toEqual({ foo: 'foo' });
    });

    it('should retrieve all items when ignoring the first argument', async () => {
      const result = await chrome.storage.sync.get();

      expect(result).toEqual(dummyItems);
    });

    it('should return an empty object if the string key does not exist', async () => {
      const result = await chrome.storage.sync.get('baz');

      expect(result).toEqual({});
    });

    it('should only return existing keys when passing an array', async () => {
      const result = await chrome.storage.sync.get(['foo', 'baz']);

      expect(result).toEqual({ foo: 'foo' });
    });

    it('should return default values when passing an object with missing keys', async () => {
      const result = await chrome.storage.sync.get({
        foo: 'default',
        baz: 'default',
      });

      expect(result).toEqual({ foo: 'foo', baz: 'default' });
    });
  });
});
