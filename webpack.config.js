const path = require('path');
const json5 = require('json5');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = (env, args) => {
  let entry = {
    // Content scripts
    communityConsoleMain: './src/contentScripts/communityConsole/main.js',
    communityConsoleStart: './src/contentScripts/communityConsole/start.js',
    publicForum: './src/contentScripts/publicForum.js',
    publicThread: './src/contentScripts/publicThread.js',
    profile: './src/contentScripts/profile.js',
    profileIndicator: './src/contentScripts/profileIndicator.js',

    // Injected JS
    profileIndicatorInject: './src/injections/profileIndicator.js',
    batchLockInject: './src/injections/batchLock.js',
    xhrInterceptorInject: './src/injections/xhrInterceptor.js',

    // Options page
    optionsCommon: './src/optionsCommon.js',
  };

  // Background script (or service worker for MV3)
  if (env.browser_target == 'chromium_mv3')
    entry.sw = './src/sw.js';
  else
    entry.background = './src/background.js';

  let outputPath = path.join(__dirname, 'dist', env.browser_target);

  return {
    entry,
    output: {
      filename: '[name].bundle.js',
      path: outputPath,
      clean: true,
    },
    plugins: [
      new WebpackShellPluginNext({
        onBuildEnd: {
          scripts:
              ['go run tools/generateManifest.go -dest=' +
               path.join(outputPath, 'manifest.json') + ' ' +
               env.browser_target]
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, 'src/static'),
            to: outputPath,
            globOptions: {
              ignore: ['**/OWNERS'],
            }
          },
        ]
      }),
    ],
    // NOTE: Change to
    //   (args.mode == 'production' ? 'source-map' : 'inline-source-map')
    // once https://crbug.com/212374 is fixed.
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.json5$/,
          type: 'json',
          parser: {
            parse: json5.parse,
          },
        },
      ]
    },
  };
};
