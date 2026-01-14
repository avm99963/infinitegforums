const path = require('path');

module.exports = function() {
  const rootDir = path.resolve(__dirname, '../../../../');
  const relativePath = path.relative(rootDir, this.resourcePath);
  return `export default ${JSON.stringify(relativePath)};`;
};
