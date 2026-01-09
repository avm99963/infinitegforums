import { LatestSchema as RealLatestSchema } from '@/storage/schemas';
import { SyncStorageAreaRepositoryPort } from '@/storage/repositories/syncStorageAreaRepository.port';
import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import { StorageMigratorPort } from '@/storage/services/storageMigrator.port';
import { isomorphicChromeStorage } from './isomorphicChromeStorage';

export class SyncStorageAreaRepositoryAdapter<
  LatestSchema = RealLatestSchema,
> implements SyncStorageAreaRepositoryPort<LatestSchema> {
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);

  constructor(
    private readonly latestSchemaVersion: number,
    private readonly storageMigrator: StorageMigratorPort,
  ) {}

  async get<Items extends Partial<LatestSchema>>(
    itemKeys?: NoInfer<undefined | (keyof Items)[]>,
  ): Promise<Items> {
    return this.mutex.runExclusive(async () => {
      await this.ensureSchemaIsUpdated();
      return this.unsafeGet(itemKeys) as Promise<Items>;
    });
  }

  private unsafeGet<Items extends Partial<any>>(
    itemKeys?: NoInfer<undefined | (keyof Items)[]>,
  ): Promise<Items> {
    return isomorphicChromeStorage.sync.get(itemKeys) as Promise<Items>;
  }

  async set(items: Partial<LatestSchema>): Promise<void> {
    return this.mutex.runExclusive(async () => {
      await this.ensureSchemaIsUpdated();
      await this.unsafeSet(items);
    });
  }

  private async unsafeSet(items: Partial<LatestSchema>): Promise<void> {
    await isomorphicChromeStorage.sync.set(items);
  }

  private async ensureSchemaIsUpdated(): Promise<void> {
    const currentVersion = await this.getCurrentSchemaVersion();
    if (currentVersion < this.latestSchemaVersion) {
      await this.migrate();
    } else if (currentVersion > this.latestSchemaVersion) {
      throw new Error(
        `Cannot ensure that the sync storage area is using an up-to-date schema version. The current schema version (${currentVersion}) is greater than the up-to-date version (${this.latestSchemaVersion}).`,
      );
    }
  }

  private async migrate(): Promise<void> {
    try {
      return this.storageMigrator.migrate();
    } catch (err) {
      throw new Error('Cannot migrate the sync storage area.', { cause: err });
    }
  }

  private async getCurrentSchemaVersion(): Promise<number> {
    const items = await isomorphicChromeStorage.sync.get('$schemaVersion');
    if (typeof items?.$schemaVersion == 'number') {
      return items.$schemaVersion;
    } else {
      return 0;
    }
  }
}
