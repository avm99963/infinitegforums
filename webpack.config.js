const webpack = require('webpack');
const path = require('path');
const json5 = require('json5');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, args) => {
  // NOTE: When adding an entry, add the corresponding source map file to
  // web_accessible_resources in //manifest/manifest.template.gjson.
  const entry = {
    // Content scripts
    communityConsoleMain:
        './src/entryPoints/communityConsole/contentScripts/main/main.js',
    communityConsoleStart:
        './src/entryPoints/communityConsole/contentScripts/start/start.js',
    communityConsoleInjectionMain:
        './src/entryPoints/communityConsole/injections/main/main.js',
    communityConsoleInjectionStart:
        './src/entryPoints/communityConsole/injections/start/start.js',
    publicForum: './src/contentScripts/publicForum.js',
    publicThread: './src/contentScripts/publicThread.js',
    publicThreadStart: './src/entryPoints/twBasic/thread/start/start.js',
    publicGuide: './src/contentScripts/publicGuide.js',
    publicGuideStart: './src/contentScripts/publicGuideStart.js',
    publicProfile: './src/contentScripts/publicProfile.js',
    publicProfileStart: './src/contentScripts/publicProfileStart.js',
    profileIndicator: './src/contentScripts/profileIndicator.js',

    // Programatically injected content scripts
    handleInstall:
        './src/entryPoints/communityConsole/injections/handleInstall/handleInstall.js',
    handleUpdate:
        './src/entryPoints/communityConsole/injections/handleUpdate/handleUpdate.js',

    // Injected JS
    profileIndicatorInject: './src/injections/profileIndicator.js',
    batchLockInject: './src/injections/batchLock.js',
    extraInfoInject: './src/injections/extraInfo.js',
    litComponentsInject: './src/injections/litComponentsInject.js',
    updateHandlerLitComponents:
        './src/injections/updateHandlerLitComponents.js',

    // Old options page
    optionsCommonOld: './src/options/old/optionsCommon.js',

    // New options page
    optionsScript: './src/options/presentation/scripts/options.js',

    // Workflow manager
    workflowManager: './src/features/workflows/ui/components/manager/index.js',

    // Common CSS
    mdcStyles: './src/ui/styles/mdc/index.js',

    // Background script (or service worker for MV3)
    bg: './src/bg/bg.js',
  };

  const isCanaryBuild = env.canary == 'true';

  const outputPath = path.join(__dirname, 'dist', env.browser_target);

  const preprocessorLoader = {
    loader: 'webpack-preprocessor-loader',
    options: {
      params: {
        browser_target: env.browser_target,
        production: args.mode == 'production',
        canary: isCanaryBuild,
        enable_bulk_crs: env.enable_bulk_crs === 'true' ?? false,
      },
    },
  };

  const sassLoaderOptions = {
    // Prefer `dart-sass`
    implementation: require('sass'),
    sassOptions: {
      quietDeps: true,
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
      new HtmlWebpackPlugin({
        filename: 'workflows.html',
        template:
            'src/features/workflows/presentation/templates/workflows.html.ejs',
        chunks: ['workflowManager'],
      }),
      new HtmlWebpackPlugin({
        filename: 'options.html',
        template: 'src/options/presentation/templates/options.html.ejs',
        chunks: ['optionsScript'],
      }),
      new webpack.DefinePlugin({
        'PRODUCTION': args.mode == 'production',
      }),
    ],
    devtool: (args.mode == 'production' ? 'source-map' : 'inline-source-map'),
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json', '.wasm'],
    },
    module: {
      rules: [
        {
          test: /\.js$/i,
          extractSourceMap: true,
          use: [
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
          test: /\.css$/i,
          resourceQuery: /string/,
          use: ['css-loader'],
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
                  options: sassLoaderOptions,
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
                  options: sassLoaderOptions,
                },
              ],
            },
            {
              use: [
                'style-loader',
                'css-loader',
                {
                  loader: 'sass-loader',
                  options: sassLoaderOptions,
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
