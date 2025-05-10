import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reportsDirectory: './out/coverage',
    },
    // We only want to see console logs printed for failing tests, since
    // otherwise they just pollute the test's STDOUT.
    silent: 'passed-only',
  },
});
