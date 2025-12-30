export type SchemaV1 = {
  $schemaVersion: 1;
  /**
   * Option values.
   *
   * In the future, these will be saved in a single item called `options`.
   * We haven't changed this yet because it is not easy to do now.
   */
  [optionCodename: string]: unknown;
  /** List of option codenames for which the kill switch is active. */
  _forceDisabledFeatures?: string[];
};
