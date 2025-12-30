export interface StorageMigratorPort {
  /**
   * Upgrades the storage area schema to the latest version.
   */
  migrate(): Promise<void>;
}
