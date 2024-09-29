const webpack = require('webpack');
const path = require('path');
const json5 = require('json5');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

// Pontoon uses their own locale set. This array lets us convert those locales
// to the ones accepted by Chrome, Firefox, etc.
const localeOverrides = [
  {
    pontoonLocale: 'pt-rBR',
    webExtLocale: 'pt_BR',
  },
  {
    pontoonLocale: 'pt-rBR',
    webExtLocale: 'pt_PT',
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
  // NOTE: When adding an entry, add the corresponding source map file to
  // web_accessible_resources in //templates/manifest.gjson.
  let entry = {
    // Content scripts
    communityConsoleMain:
        './src/platforms/communityConsole/entryPoints/main.ts',
    communityConsoleStart:
        './src/platforms/communityConsole/entryPoints/start.ts',
    publicForum: './src/contentScripts/publicForum.js',
    publicThread: './src/contentScripts/publicThread.js',
    publicThreadStart: './src/contentScripts/publicThreadStart.js',
    publicGuide: './src/contentScripts/publicGuide.js',
    publicGuideStart: './src/contentScripts/publicGuideStart.js',
    publicProfile: './src/contentScripts/publicProfile.js',
    publicProfileStart: './src/contentScripts/publicProfileStart.js',
    profileIndicator: './src/contentScripts/profileIndicator.js',

    // Programatically injected content scripts
    handleInstall: './src/contentScripts/communityConsole/handleInstall.js',
    handleUpdate: './src/contentScripts/communityConsole/handleUpdate.js',

    // Injected JS
    profileIndicatorInject: './src/injections/profileIndicator.js',
    batchLockInject: './src/injections/batchLock.js',
    xhrInterceptorInject: './src/injections/xhrProxy.js',
    extraInfoInject: './src/injections/extraInfo.js',
    litComponentsInject: './src/injections/litComponentsInject.js',
    updateHandlerLitComponents:
        './src/injections/updateHandlerLitComponents.js',

    // Options page
    optionsCommon: './src/options/optionsCommon.js',

    // Workflow manager
    workflowManager: './src/features/workflows/core/manager/index.js',

    // Common CSS
    mdcStyles: './src/mdc/index.js',

    // Compiled Sass
    ccDarkTheme: './src/features/ccDarkTheme/core/styles/main.scss?asCSSFile',
  };

  // Background script (or service worker for MV3)
  entry.bg = './src/bg.js';

  let outputPath = path.join(__dirname, 'dist', env.browser_target);

  let overridenLocalePaths =
      localeOverrides.map(l => '**/_locales/' + l.pontoonLocale);

  let preprocessorLoader = {
    loader: 'webpack-preprocessor-loader',
    options: {
      params: {
        browser_target: env.browser_target,
        production: args.mode == 'production',
        canary: !!env.canary
      },
    },
  };

  return {
    entry,
    output: {
      filename: '[name].bundle.js',
      path: outputPath,
      clean: true,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].bundle.css',
      }),
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: ['make lit_localize_build'],
          blocking: true,
        },
        onBuildEnd: {
          scripts:
              ['genmanifest -template templates/manifest.gjson -dest ' +
               path.join(outputPath, 'manifest.json') + ' ' +
               env.browser_target]
        }
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(
                __dirname, 'src/icons', env.canary ? 'canary' : 'regular'),
            to: path.join(outputPath, 'icons'),
          },
        ]
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
      new HtmlWebpackPlugin({
        filename: 'workflows.html',
        template: 'src/features/workflows/templates/workflows.html.ejs',
        chunks: ['workflowManager'],
      }),
      new webpack.DefinePlugin({
        'PRODUCTION': args.mode == 'production',
      }),
      ...getCopyPluginsForOverridenLocales(outputPath),
    ],
    devtool: (args.mode == 'production' ? 'source-map' : 'inline-source-map'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.wasm'],
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          use: [
            preprocessorLoader,
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            'ts-loader',
            preprocessorLoader,
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.json5$/i,
          type: 'json',
          parser: {
            parse: json5.parse,
          },
          use: [
            preprocessorLoader,
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          oneOf: [
            {
              resourceQuery: /string/,
              use: [
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
            {
              resourceQuery: /asCSSFile/,
              use: [
                MiniCssExtractPlugin.loader,
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
            {
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
          ],
        },
      ]
    },
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              ascii_only:
                  true,  // Due to https://iavm.xyz/b/twpowertools/145#c1
            },
          },
        }),
      ],
    },
  };
};
