import { SchemaV0 } from './v0';

export type LatestSchema = SchemaV0;
export const LATEST_SCHEMA_VERSION = 0;

/**
 * Returns the default items for the latest schema.
 */
export function getDefaultStorage(): LatestSchema {
  return {
    _forceDisabledFeatures: [],
  };
}
