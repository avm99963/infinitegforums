import {
  describe,
  test as baseTest,
  beforeEach,
  vi,
  expect,
  Mock,
} from 'vitest';
import { SyncStorageMigratorAdapter } from './syncStorageMigrator.adapter';
import { StorageAreaMigration } from '@/storage/domain/Migration';
import '@/tests/__mocks__/storageArea';

const fakeLatestSchemaVersion = 10;

const test = baseTest.extend<{
  sortedMigrations: StorageAreaMigration<unknown, unknown>[];
  defaultStorageFactory: () => any;
  sut: SyncStorageMigratorAdapter<any>;
}>({
  sortedMigrations: [],
  defaultStorageFactory: async ({}, use) => {
    await use(() => ({ someDefault: 'value' }));
  },
  sut: async ({ sortedMigrations, defaultStorageFactory }, use) => {
    const sut = new SyncStorageMigratorAdapter(
      sortedMigrations,
      fakeLatestSchemaVersion,
      defaultStorageFactory,
    );
    await use(sut);
  },
});

const getDummyMigration = ({
  version,
  execute,
}: {
  version: number;
  execute?: Mock<(oldSchema: any) => any>;
}) =>
  new (class implements StorageAreaMigration<unknown, unknown> {
    version = version;
    execute =
      execute ??
      vi.fn((items) => {
        return { $schemaVersion: version, ...items };
      });
  })();

beforeEach(() => {
  chrome.storage.sync.clear();
  vi.restoreAllMocks();
});

describe('migrate', () => {
  test('should do nothing if schema is already up to date', async ({ sut }) => {
    await chrome.storage.sync.set({ $schemaVersion: fakeLatestSchemaVersion });
    (chrome.storage.sync.set as Mock).mockClear();
    (chrome.storage.sync.clear as Mock).mockClear();

    await sut.migrate();

    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
    expect(chrome.storage.sync.clear).not.toHaveBeenCalled();
  });

  test('should do nothing if schema is newer than known latest', async ({
    sut,
  }) => {
    await chrome.storage.sync.set({
      $schemaVersion: fakeLatestSchemaVersion + 1,
    });
    (chrome.storage.sync.set as Mock).mockClear();

    await sut.migrate();

    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  });

  test('should initialize storage with default items if empty', async ({
    sut,
  }) => {
    await sut.migrate();

    const items = await chrome.storage.sync.get();
    expect(items).toEqual({ someDefault: 'value' });
  });

  test('should migrate from v0 (undefined) to latest', async ({}) => {
    const executeMock = vi.fn((items) => ({
      ...items,
      $schemaVersion: fakeLatestSchemaVersion,
      migrated: true,
    }));
    const migration = getDummyMigration({ version: 5, execute: executeMock });
    const sut = new SyncStorageMigratorAdapter(
      [migration],
      fakeLatestSchemaVersion,
      () => ({}),
    );

    await chrome.storage.sync.set({ someOption: true }); // v0 data

    await sut.migrate();

    const items = await chrome.storage.sync.get();
    expect(items).toEqual({
      someOption: true,
      migrated: true,
      $schemaVersion: fakeLatestSchemaVersion,
    });
  });

  test('should compose migrations', async ({}) => {
    const m1 = getDummyMigration({
      version: 1,
      execute: vi.fn((items) => ({
        ...items,
        $schemaVersion: 1,
        v1: true,
      })),
    });
    const m2 = getDummyMigration({
      version: 5,
      execute: vi.fn((items) => ({
        ...items,
        $schemaVersion: 5,
        v5: items.v1,
      })),
    });

    const sut = new SyncStorageMigratorAdapter([m1, m2], 5, () => ({}));
    await chrome.storage.sync.set({ $schemaVersion: 0 });

    await sut.migrate();

    expect(m1.execute).toHaveBeenCalled();
    expect(m2.execute).toHaveBeenCalled();
    const items = await chrome.storage.sync.get();
    expect(items).toEqual({
      $schemaVersion: 5,
      v1: true,
      v5: true,
    });
  });

  test('should only run migrations strictly greater than current version', async ({}) => {
    const m1 = getDummyMigration({ version: 2 });
    const m2 = getDummyMigration({ version: 5 });
    const sut = new SyncStorageMigratorAdapter(
      [m1, m2],
      fakeLatestSchemaVersion,
      () => ({}),
    );

    await chrome.storage.sync.set({ $schemaVersion: 2 });

    await sut.migrate();

    expect(m1.execute).not.toHaveBeenCalled();
    expect(m2.execute).toHaveBeenCalled();
  });

  test('should only run migration once on concurrent requests', async ({}) => {
    // We'll finish the migration when we want.
    let resolveMigration: () => void;
    const migrationPromise = new Promise<any>(
      (resolve) =>
        (resolveMigration = () => {
          resolve({
            $schemaVersion: 5,
          });
        }),
    );

    const migration = getDummyMigration({
      version: 5,
      execute: vi.fn(() => migrationPromise),
    });

    const sut = new SyncStorageMigratorAdapter(
      [migration],
      fakeLatestSchemaVersion,
      () => ({}),
    );
    await chrome.storage.sync.set({ $schemaVersion: 0 });

    const p1FinishedCallback = vi.fn();
    const p2FinishedCallback = vi.fn();

    // p1 starts, but the migration doesn't end since we haven't called yet
    // resolveMigration.
    //
    // Then p2 starts, and should wait for the existing migration to end.
    const p1 = sut.migrate().then(() => p1FinishedCallback());
    const p2 = sut.migrate().then(() => p2FinishedCallback());

    expect(p1FinishedCallback).not.toHaveBeenCalled();
    expect(p2FinishedCallback).not.toHaveBeenCalled();

    // Let the migration finish.
    resolveMigration();

    await Promise.allSettled([p1, p2]);

    expect(migration.execute).toHaveBeenCalledTimes(1);
  });
});
