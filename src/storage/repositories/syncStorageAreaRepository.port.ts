import { LatestSchema as RealLatestSchema } from '../schemas';

/**
 * Repository which lets users read and write the sync storage area.
 *
 * It abstracts away the complexity of managing the sync storage area, whose
 * schema can change over time as our needs change. It basically acts as a
 * transparent layer in which users can think that they are always interacting
 * with an up-to-date schema.
 *
 * It does so by migrating (if needed) the schema before each read/write
 * operation is executed. This thus eliminates the need for users to think about
 * older versions of the schema.
 */
export interface SyncStorageAreaRepositoryPort<
  LatestSchema = RealLatestSchema,
> {
  /**
   * Get items from the sync storage area, upgrading them first if not up to
   * date.
   *
   * @param itemKeys List of keys for which to retrieve their items. If
   * undefined, all the storage area items are returned.
   */
  get<Items extends Partial<LatestSchema>>(
    itemKeys?: NoInfer<undefined | (keyof Items)[]>,
  ): Promise<Items>;

  /**
   * Set items in the sync storage area, upgrading them first if not up to date.
   *
   * Only the keys found in {@link items} are modified. Other items already
   * present in the storage area are left intact and not deleted.
   */
  set(items: Partial<LatestSchema>): Promise<void>;
}
