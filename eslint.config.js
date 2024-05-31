const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');

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
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];
