/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset : 'ts-jest/presets/js-with-ts',
  moduleFileExtensions : ['js', 'mjs', 'ts'],
  testRegex : '(/__tests__/.*|(\\.|/)(test|spec))\\.m?[jt]sx?$',
  coverageProvider : 'v8',
  coverageDirectory : './out/coverage/',
  testEnvironment : 'jsdom',
};
