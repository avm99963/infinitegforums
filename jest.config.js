/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset : 'ts-jest/presets/js-with-ts-esm',
  moduleFileExtensions : ['js', 'mjs', 'ts'],
  testRegex : '(/__tests__/.*|(\\.|/)(test|spec))\\.m?[jt]sx?$',
  coverageProvider : 'v8',
  testEnvironment : 'jsdom',
};
