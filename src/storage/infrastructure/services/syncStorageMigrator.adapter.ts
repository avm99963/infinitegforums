import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import { StorageAreaMigration } from '@/storage/domain/Migration';
import { StorageMigratorPort } from '@/storage/services/storageMigrator.port';
import { LatestSchema as RealLatestSchema } from '@/storage/schemas';

export class SyncStorageMigratorAdapter<
  LatestSchema = RealLatestSchema,
> implements StorageMigratorPort {
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);

  constructor(
    private readonly sortedMigrations: StorageAreaMigration<unknown, unknown>[],
    private readonly latestSchemaVersion: number,
    private readonly defaultStorageFactory: () => LatestSchema,
  ) {}

  async migrate(): Promise<void> {
    return this.mutex.runExclusive(async () => {
      const items = await chrome.storage.sync.get(null);

      if (Object.keys(items).length === 0) {
        await chrome.storage.sync.set(this.defaultStorageFactory());
        return;
      }

      const currentVersion = this.getCurrentSchemaVersion(items);
      if (currentVersion < this.latestSchemaVersion) {
        await this.updateSchema(items, currentVersion);
      }
    });
  }

  private getCurrentSchemaVersion(items: any): number {
    if (typeof items?.$schemaVersion == 'number') {
      return items.$schemaVersion;
    } else {
      // If $schemaVersion is not set, we assume it's the legacy schema (v0).
      return 0;
    }
  }

  private async updateSchema(
    items: any,
    currentVersion: number,
  ): Promise<void> {
    const firstMigrationIdx = this.getFirstMigrationToRun(currentVersion);
    for (let i = firstMigrationIdx; i < this.sortedMigrations.length; i++) {
      items = await this.sortedMigrations[i].execute(items);
    }
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set(items);
  }

  private getFirstMigrationToRun(currentVersion: number): number {
    let left = 0;
    let right = this.sortedMigrations.length;

    while (left < right) {
      const middle = Math.floor((left + right) / 2);
      if (this.sortedMigrations[middle].version <= currentVersion) {
        left = middle + 1;
      } else {
        right = middle;
      }
    }

    return left;
  }
}
