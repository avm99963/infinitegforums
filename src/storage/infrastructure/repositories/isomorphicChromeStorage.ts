const promisifyStorageArea = (areaName: 'sync' | 'local' | 'session') => {
  const performAction = <T>(
    action: (
      area: chrome.storage.StorageArea,
      callback: (result: T) => void,
    ) => void,
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      const area = chrome.storage?.[areaName];
      if (!area) {
        return reject(new Error(`chrome.storage.${areaName} is not available`));
      }

      action(area, (result: T) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(result);
        }
      });
    });
  };

  return {
    get: (keys?: string | string[] | { [key: string]: any } | null) =>
      performAction<{ [key: string]: any }>((area, cb) => area.get(keys, cb)),
    set: (items: { [key: string]: any }) =>
      performAction<void>((area, cb) => area.set(items, () => cb())),
    remove: (keys: string | string[]) =>
      performAction<void>((area, cb) => area.remove(keys, () => cb())),
    clear: () => performAction<void>((area, cb) => area.clear(() => cb())),
  };
};

export const isomorphicChromeStorage = {
  sync: promisifyStorageArea('sync'),
  local: promisifyStorageArea('local'),
  session: promisifyStorageArea('session'),
};
