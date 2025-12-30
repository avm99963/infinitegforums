import { StorageAreaMigration } from '../domain/Migration';
import { V1MergeFeaturesMigration } from './v1Migration';

const migrations: StorageAreaMigration<unknown, unknown>[] = [
  new V1MergeFeaturesMigration(),
];

// Sorting migrations just in case, but migrations should already be sorted.
const sortedMigrations = migrations.sort((a, b) => a.version - b.version);

export default sortedMigrations;
