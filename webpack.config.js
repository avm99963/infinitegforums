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

module.exports = (env, args) => {
  // NOTE: When adding an entry, add the corresponding source map file to
  // web_accessible_resources in //templates/manifest.gjson.
  const entry = {
    // Content scripts
    communityConsoleMain:
        './src/entryPoints/communityConsole/contentScripts/main.ts',
    communityConsoleStart:
        './src/entryPoints/communityConsole/contentScripts/start.ts',
    communityConsoleInjectionStart:
        './src/entryPoints/communityConsole/injections/start.ts',
    publicForum: './src/contentScripts/publicForum.js',
    publicThread: './src/contentScripts/publicThread.js',
    publicThreadStart: './src/entryPoints/twBasic/thread/start.ts',
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
    extraInfoInject: './src/injections/extraInfo.js',
    litComponentsInject: './src/injections/litComponentsInject.js',
    updateHandlerLitComponents:
        './src/injections/updateHandlerLitComponents.js',

    // Old options page
    optionsCommonOld: './src/options/old/optionsCommon.js',

    // New options page
    optionsScript: './src/options/presentation/scripts/options.ts',

    // Workflow manager
    workflowManager: './src/features/workflows/core/manager/index.js',

    // Common CSS
    mdcStyles: './src/mdc/index.js',

    // Compiled Sass
    ccDarkTheme: './src/features/ccDarkTheme/core/styles/main.scss?asCSSFile',

    // Background script (or service worker for MV3)
    bg: './src/bg.js',
  };

  // NOTE: When adding an entry, add the corresponding source map file to
  // web_accessible_resources in //templates/manifest.gjson.
  const styles = [
    {
      origin: './src/features/avatars/ui/styles.css',
      destination: 'css/thread_list_avatars.css',
    },
    {
      origin: './src/features/batchLock/ui/styles.css',
      destination: 'css/batchlock_inject.css',
    },
    {
      origin: './src/features/bulkReportReplies/ui/styles.css',
      destination: 'css/bulk_report_replies.css',
    },
    {
      origin: './src/features/enhancedAnnouncementsDot/ui/styles.css',
      destination: 'css/enhanced_announcements_dot.css',
    },
    {
      origin: './src/features/fixedToolbar/ui/styles.css',
      destination: 'css/fixed_toolbar.css',
    },
    {
      origin: './src/features/imageMaxHeight/ui/styles.css',
      destination: 'css/image_max_height.css',
    },
    {
      origin: './src/features/increaseContrast/ui/styles.css',
      destination: 'css/increase_contrast.css',
    },
    {
      origin: './src/features/repositionExpandThread/ui/styles.css',
      destination: 'css/reposition_expand_thread.css',
    },
    {
      origin: './src/features/stickySidebarHeaders/ui/styles.css',
      destination: 'css/sticky_sidebar_headers.css',
    },
    {
      origin: './src/features/threadToolbar/ui/styles.css',
      destination: 'css/thread_toolbar.css',
    },
  ];

  const outputPath = path.join(__dirname, 'dist', env.browser_target);

  const overridenLocalePaths =
      localeOverrides.map(l => '**/_locales/' + l.pontoonLocale);

  const preprocessorLoader = {
    loader: 'webpack-preprocessor-loader',
    options: {
      params: {
        browser_target: env.browser_target,
        production: args.mode == 'production',
        canary: !!env.canary
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
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: ['make lit_localize_build'],
          blocking: true,
        },
      }),
      new WebpackShellPluginNext({
        onBuildEnd: {
          scripts:
              ['genmanifest -template templates/manifest.gjson -dest ' +
               path.join(outputPath, 'manifest.json') + ' ' +
               env.browser_target]
        },
        // This makes this command run multiple times when building on watch
        // mode.
        dev: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(
                __dirname, 'src/icons', env.canary ? 'canary' : 'regular'),
            to: path.join(outputPath, 'icons'),
          },
          {
            from: path.join(__dirname, 'src/static'),
            to: outputPath,
            globOptions: {
              ignore: ['**/OWNERS', '**.md', ...overridenLocalePaths],
            }
          },
          ...getStylesCopyPatterns(styles),
        ]
      }),
      new HtmlWebpackPlugin({
        filename: 'workflows.html',
        template:
            'src/features/workflows/presentation/templates/workflows.html.ejs',
        chunks: ['workflowManager'],
      }),
      new HtmlWebpackPlugin({
        filename: 'options.html',
        template:
            'src/options/presentation/templates/options.html.ejs',
        chunks: ['optionsScript'],
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

const getStylesCopyPatterns = styles => {
  return styles.map(s => {
    return {
      from: path.join(__dirname, s.origin),
      to: s.destination,
    };
  });
}
