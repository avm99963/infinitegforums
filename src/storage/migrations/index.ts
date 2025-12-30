import { StorageAreaMigration } from '../domain/Migration';

const migrations: StorageAreaMigration<unknown, unknown>[] = [];

// Sorting migrations just in case, but migrations should already be sorted.
const sortedMigrations = migrations.sort((a, b) => a.version - b.version);

export default sortedMigrations;
