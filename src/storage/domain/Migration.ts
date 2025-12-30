/**
 * Defines a migration used to upgrade the sync storage area to a new version
 * ({@link StorageAreaMigration.version}) from its immediate previous version.
 */
export interface StorageAreaMigration<Before, After> {
  /**
   * Version into which the migration updates the schema.
   *
   * NOTE: This should be unique, since there should be one migration per schema
   * version.
   */
  version: number;

  /**
   * Method that performs the actual migration in the storage area.
   *
   * @returns The new items as saved in the storage area under the new schema.
   */
  execute(
    /**
     * Old items in the storage area.
     */
    oldItems: Before,
  ): After | Promise<After>;
}
