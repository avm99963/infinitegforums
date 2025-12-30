import { StorageAreaMigration } from '../domain/Migration';
import { SchemaV0 } from '../schemas/v0';
import { SchemaV1 } from '../schemas/v1';

export class V1MergeFeaturesMigration implements StorageAreaMigration<
  SchemaV0,
  SchemaV1
> {
  version = 1;

  execute(oldStorageItems: SchemaV0): SchemaV1 {
    const storageItems: SchemaV1 = {
      ...oldStorageItems,
      $schemaVersion: 1,
    };

    // Merge threadall into the thread feature.
    storageItems.thread_mode =
      storageItems.threadall === true ? 'all_at_once' : 'in_batches';
    if (storageItems.hasOwnProperty('threadall')) {
      storageItems.thread =
        (storageItems.thread ?? false) || storageItems.threadall;
      delete storageItems.threadall;
    }

    // Merge profileindicator into the profileindicatoralt feature.
    if (storageItems.hasOwnProperty('profileindicator')) {
      storageItems.profileindicatoralt =
        (storageItems.profileindicatoralt ?? false) ||
        storageItems.profileindicator;
      delete storageItems.profileindicator;
    }

    return storageItems;
  }
}
