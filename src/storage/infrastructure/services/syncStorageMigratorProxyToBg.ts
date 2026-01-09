import { StorageMigratorPort } from '@/storage/services/storageMigrator.port';

export const PERFORM_MIGRATION_MESSAGE_NAME = 'performSyncStorageMigration';

export class SyncStorageMigratorProxyToBgAdapter implements StorageMigratorPort {
  async migrate(): Promise<void> {
    const response = await new Promise<{ error?: string }>((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          message: PERFORM_MIGRATION_MESSAGE_NAME,
        },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve(response);
          }
        },
      );
    });

    if (response?.error) {
      throw new Error(response.error);
    }
  }
}
