const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const vitest = require('@vitest/eslint-plugin');

module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      '**/*.js',
      '**/*.mjs',
      'dist/',
      'out/',
      'src/lit-locales/generated/',
    ],
  },
  {
    ignores: ['webpack.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        PRODUCTION: 'readonly',
        ...globals.browser,
        ...globals.webextensions,
      },
    },
  },
  {
    files: ['**/*.test.ts'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/expect-expect': [
        'error',
        {
          assertFunctionNames: [
            // Default options
            // See https://github.com/vitest-dev/eslint-plugin-vitest/blob/f08b810c8dce545ebd79e025b297d15c99f36d9a/src/rules/expect-expect.ts#L43
            'expect',
            'assert',

            // Custom conventions for helper functions.
            'check*',
          ],
        },
      ],
    },
  },
];
