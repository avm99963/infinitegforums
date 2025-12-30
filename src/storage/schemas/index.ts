import { SchemaV1 } from './v1';

export type LatestSchema = SchemaV1;
export const LATEST_SCHEMA_VERSION = 1;

/**
 * Returns the default items for the latest schema.
 */
export function getDefaultStorage(): LatestSchema {
  return {
    $schemaVersion: 1,
    _forceDisabledFeatures: [],
  };
}
