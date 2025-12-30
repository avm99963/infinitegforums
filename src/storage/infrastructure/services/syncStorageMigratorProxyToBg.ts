import { StorageMigratorPort } from '@/storage/services/storageMigrator.port';

export const PERFORM_MIGRATION_MESSAGE_NAME = 'performSyncStorageMigration';

export class SyncStorageMigratorProxyToBgAdapter implements StorageMigratorPort {
  async migrate(): Promise<void> {
    const response = await chrome.runtime.sendMessage({
      message: PERFORM_MIGRATION_MESSAGE_NAME,
    });

    if (response?.error) {
      throw new Error(response.error);
    }
  }
}
