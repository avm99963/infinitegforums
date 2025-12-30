import { describe, test as baseTest, beforeEach, vi, expect } from 'vitest';
import { SyncStorageAreaRepositoryAdapter } from './syncStorageAreaRepository.adapter';
import '@/tests/__mocks__/storageArea';
import { StorageMigratorPort } from '@/storage/services/storageMigrator.port';

const fakeLatestSchemaVersion = 10 as const;
type FakeSchema = {
  $schemaVersion: typeof fakeLatestSchemaVersion;
  options: {
    foo?: string;
    bar?: boolean;
  };
  busFactor?: number;
};

const defaultFakeSchemaUpdater: StorageMigratorPort['migrate'] = async () => {
  const items = await chrome.storage.sync.get();
  await chrome.storage.sync.set({
    ...items,
    $schemaVersion: fakeLatestSchemaVersion,
  });
};
const migrateMock = vi.fn<StorageMigratorPort['migrate']>(
  defaultFakeSchemaUpdater,
);

const test = baseTest.extend<{
  sut: SyncStorageAreaRepositoryAdapter<FakeSchema>;
  migrator: StorageMigratorPort;
}>({
  migrator: async ({}, use) => {
    await use(
      new (class implements StorageMigratorPort {
        migrate = migrateMock;
      })(),
    );
  },
  sut: async ({ migrator }, use) => {
    const sut = new SyncStorageAreaRepositoryAdapter<FakeSchema>(
      fakeLatestSchemaVersion,
      migrator,
    );
    await use(sut);
  },
});

const dummyOptions = {
  foo: 'bar',
};

beforeEach(() => {
  vi.resetAllMocks();
});

describe('when the storage area uses the latest schema available', () => {
  const dummyItems = {
    $schemaVersion: fakeLatestSchemaVersion,
    options: dummyOptions,
    busFactor: 1,
  };

  beforeEach(() => {
    chrome.storage.sync.clear();
    chrome.storage.sync.set(dummyItems);
  });

  describe('get method', () => {
    test('should NOT request a migration', async ({ sut }) => {
      await sut.get();

      expect(migrateMock).not.toHaveBeenCalled();
    });

    test('should retrieve the items from the keys supplied', async ({
      sut,
    }) => {
      const result = await sut.get(['options', 'busFactor']);

      expect(result).toEqual({
        options: dummyOptions,
        busFactor: 1,
      });
    });

    test('should retrieve all the items when the keys supplied is undefined', async ({
      sut,
    }) => {
      const result = await sut.get(undefined);

      expect(result).toEqual(dummyItems);
    });

    test('should retrieve all the items when the keys parameter is not supplied', async ({
      sut,
    }) => {
      const result = await sut.get();

      expect(result).toEqual(dummyItems);
    });

    test('should retrieve all the items when the keys parameter is not supplied', async ({
      sut,
    }) => {
      chrome.storage.sync.clear();
      chrome.storage.sync.set({
        $schemaVersion: fakeLatestSchemaVersion,
        busFactor: 1,
      });

      const result = await sut.get(['options']);

      expect(result).toEqual({});
    });
  });

  describe('set method', () => {
    test('should NOT request a migration', async ({ sut }) => {
      await sut.set({});

      expect(migrateMock).not.toHaveBeenCalled();
    });

    test('should change the supplied item', async ({ sut }) => {
      const newOptions = {};

      await sut.set({ options: newOptions });
      const items = await chrome.storage.sync.get();

      expect(items.options).toEqual(newOptions);
    });

    test('should preserve other items', async ({ sut }) => {
      await sut.set({ options: {} });
      const items = await chrome.storage.sync.get();

      expect(items.busFactor).toEqual(1);
    });
  });
});

describe('when the storage area does NOT use the latest schema available', () => {
  const dummyOutdatedItems = {
    $schemaVersion: 0,
    bar: false,
  };

  const dummyUpToDateItems = {
    $schemaVersion: fakeLatestSchemaVersion,
    options: {
      bar: false,
    },
  };

  beforeEach(() => {
    chrome.storage.sync.clear();
    chrome.storage.sync.set(dummyOutdatedItems);

    migrateMock.mockImplementation(async () => {
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set(dummyUpToDateItems);
    });
  });

  describe('get method', () => {
    test('should request a migration', async ({ sut }) => {
      await sut.get();
      expect(migrateMock).toHaveBeenCalled();
    });

    test('should retrieve the requested items after being upgraded', async ({
      sut,
    }) => {
      const result = await sut.get(['options']);

      expect(result.options.bar).toEqual(false);
    });
  });

  describe('set method', () => {
    test('should upgrade the storage area to the latest schema when an empty object is passed', async ({
      sut,
    }) => {
      await sut.set({});
      const rawItems = await chrome.storage.sync.get();

      expect(rawItems).toEqual(dummyUpToDateItems);
    });

    test('should upgrade the storage area to the latest schema and apply the changes requested', async ({
      sut,
    }) => {
      const changes = { options: {} };
      await sut.set(changes);
      const rawItems = await chrome.storage.sync.get();

      expect(rawItems).toEqual({
        ...dummyUpToDateItems,
        ...changes,
      });
    });
  });

  describe('regarding the possible race condition', () => {
    test('should call the migration only once even if multiple get requests arrive at the same time', async ({
      sut,
    }) => {
      migrateMock.mockImplementation(async () => {
        // Faking a long migration (taking 100ms)
        await new Promise((resolve) => setTimeout(resolve, 100));
        await defaultFakeSchemaUpdater();
      });

      const calls: Promise<unknown>[] = [];
      for (let i = 0; i < 5; i++) {
        calls.push(sut.get());
        calls.push(sut.set({}));
      }
      await Promise.allSettled(calls);

      expect(migrateMock).toHaveBeenCalledOnce();
    });
  });
});
