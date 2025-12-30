/**
 * Schema for the sync storage area before schemas were introduced.
 *
 * At that point, we saved options as individual items in the storage area, as
 * well as a special item called `_forceDisabledFeatures`.
 */
export type SchemaV0 =
  | null
  | undefined
  | {
      [optionCodename: string]: unknown;
      /** List of option codenames for which the kill switch is active. */
      _forceDisabledFeatures: string[];
    };
