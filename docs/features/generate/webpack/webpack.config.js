const path = require('path');

module.exports = () => {
  return {
    target: 'node',
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../../../../src"),
      },
      extensions: ['.js'],
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          extractSourceMap: true,
          exclude: /node_modules/,
        },
        {
          test: /\.(avif|jpg|png)$/i,
          loader: path.resolve(__dirname, 'image_path_loader.js'),
        },
      ]
    },
  };
};
