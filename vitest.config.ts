import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // TODO(https://iavm.xyz/b/twpowertools/256): Remove once tests are not run
    // outside Bazel.
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*',
      'bazel-*/**',
    ],
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
  server: {
    watch: {
      ignored: ['**/.jj/**'],
    },
  },
});
