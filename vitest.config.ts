import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Source: https://antfu.me/posts/isomorphic-dirname
// See https://github.com/vitejs/vite/issues/6946#issuecomment-1041506056
const _dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

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
  resolve: {
    alias: [
      { find: '@/', replacement: path.resolve(_dirname, './src/') + '/' },
    ],
  },
  server: {
    watch: {
      ignored: ['**/.jj/**'],
    },
  },
});
