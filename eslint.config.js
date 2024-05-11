const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        PRODUCTION: 'readonly',
        ...globals.browser,
        ...globals.webextensions,
      },
    },
    ignores: ['webpack.config.js'],
  },
  {
    files: ['**/*.test.js', '**/*.test.mjs'],
    globals: {
      ...globals.jest,
    },
  },
];
