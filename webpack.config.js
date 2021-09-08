const webpack = require('webpack');
const path = require('path');
const json5 = require('json5');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

// Pontoon uses their own locale set. This array lets us convert those locales
// to the ones accepted by Chrome, Firefox, etc.
const localeOverrides = [
  {
    pontoonLocale: 'pt-rBR',
    webExtLocale: 'pt',  // This way it targets both 'pt_BR' and 'pt_PT'
  },
];

const getCopyPluginsForOverridenLocales = outputPath => {
  return localeOverrides.map(l => {
    return new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, 'src/static/_locales/' + l.pontoonLocale),
          to: path.join(outputPath, '_locales/' + l.webExtLocale),
          globOptions: {
            ignore: ['**/OWNERS', '**.md'],
          }
        },
      ]
    });
  });
};

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
    optionsCommon: './src/options/optionsCommon.js',

    // Common CSS
    mdcStyles: './src/mdc/index.js',
  };

  // Background script (or service worker for MV3)
  if (env.browser_target == 'chromium_mv3')
    entry.sw = './src/sw.js';
  else
    entry.background = './src/background.js';

  let outputPath = path.join(__dirname, 'dist', env.browser_target);

  let overridenLocalePaths =
      localeOverrides.map(l => '**/_locales/' + l.pontoonLocale);

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
              ignore: ['**/OWNERS', '**.md', ...overridenLocalePaths],
            }
          },
        ]
      }),
      new webpack.DefinePlugin({
        'PRODUCTION': args.mode == 'production',
      }),
      ...getCopyPluginsForOverridenLocales(outputPath),
    ],
    // NOTE: Change to
    //   (args.mode == 'production' ? 'source-map' : 'inline-source-map')
    // once https://crbug.com/212374 is fixed.
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.json5$/i,
          type: 'json',
          parser: {
            parse: json5.parse,
          },
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                // Prefer `dart-sass`
                implementation: require('sass'),
              },
            },
          ],
        },
      ]
    },
  };
};
