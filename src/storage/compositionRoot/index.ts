import { SyncStorageAreaRepositoryAdapter } from '../infrastructure/repositories/syncStorageAreaRepository.adapter';
import { SyncStorageMigratorProxyToBgAdapter } from '../infrastructure/services/syncStorageMigratorProxyToBg';
import { LATEST_SCHEMA_VERSION } from '../schemas';
import { StorageMigratorPort } from '../services/storageMigrator.port';

/**
 * Retrieves a sync storage area repository with the default sensible values.
 *
 * NOTE: By default it injects {@link syncStorageMigratorProxyToBgAdapter}. In
 * the bg script, {@link SyncStorageMigratorAdapter} should be used directly.
 */
export function getSyncStorageAreaRepository(
  storageMigrator?: StorageMigratorPort,
) {
  return new SyncStorageAreaRepositoryAdapter(
    LATEST_SCHEMA_VERSION,
    storageMigrator ?? new SyncStorageMigratorProxyToBgAdapter(),
  );
}
