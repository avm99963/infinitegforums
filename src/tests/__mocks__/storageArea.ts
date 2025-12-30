import { vi } from 'vitest';

const createStorageMock = () => {
  let storage: Record<string, unknown> = {};

  return {
    get: vi.fn(
      (
        keys?: string | string[] | null | Record<string, unknown>,
        callback?: (items: unknown) => void,
      ) => {
        let result: Record<string, unknown> = {};

        if (keys === null || keys === undefined) {
          result = structuredClone(storage);
        } else if (typeof keys === 'string') {
          if (storage[keys] !== undefined) {
            result[keys] = structuredClone(storage[keys]);
          }
        } else if (Array.isArray(keys)) {
          for (const key of keys) {
            if (storage[key] !== undefined) {
              result[key] = structuredClone(storage[key]);
            }
          }
        } else if (typeof keys === 'object') {
          // Handle object with default values: { key: default }
          Object.keys(keys).forEach((key) => {
            const value =
              storage[key] !== undefined
                ? structuredClone(storage[key])
                : keys[key];
            if (value !== undefined) {
              result[key] = value;
            }
          });
        }

        if (callback) {
          callback(result);
          return undefined;
        } else {
          return Promise.resolve(result);
        }
      },
    ),

    set: vi.fn((items: Record<string, unknown>, callback?: () => void) => {
      storage = {
        ...storage,
        ...structuredClone(items),
      };

      if (callback) {
        callback();
        return undefined;
      } else {
        return Promise.resolve();
      }
    }),

    /**
     * Clears the storage area.
     */
    clear: vi.fn(() => {
      storage = {};
      return Promise.resolve();
    }),
  };
};

const chromeMock = {
  storage: {
    sync: createStorageMock(),
    local: createStorageMock(),
  },
};

vi.stubGlobal('chrome', chromeMock);
