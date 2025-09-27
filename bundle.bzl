load("@aspect_rules_js//js:defs.bzl", "js_info_files")
load("@aspect_rules_webpack//webpack:defs.bzl", "webpack_bundle")

def extension_bundle(name, **kwargs):
    # TODO(https://iavm.xyz/b/twpowertools/256): move this directly to srcs once
    # there is no longer raw typescript code being loaded into Webpack.
    #
    # We need this now because type declaration files should be included so that
    # ts-loader in Webpack can compile remaining non-compiled Typescript code.
    # Otherwise, the types are not available to ts-loader.
    transpiled_ts_sources_target = "{}_transpiled_typescript_sources".format(name)
    js_info_files(
        name = transpiled_ts_sources_target,
        srcs = [
            "//src/common/options",
        ],
        include_types = True,
    )

    webpack_bundle(
        name = name,
        srcs = native.glob([
            "src/**",
            "tsconfig.json",
        ]) + [
            ":{}".format(transpiled_ts_sources_target),
            "//src/lit-locales",
            # TODO(https://iavm.xyz/b/twpowertools/256): Move this out of the static
            # folder.
            "//src/static:common_console_styles",
        ],
        # TODO(https://iavm.xyz/b/twpowertools/256): Remove is_bazel_build once Bazel
        # replaces Webpack as the build system.
        args = ["--env=is_bazel_build=true"] + select({
            ":chromium": [
                "--env=browser_target=chromium_mv3",
            ],
            ":gecko": [
                "--env=browser_target=gecko",
            ],
        }) + select({
            ":canary": [
                "--env=canary=true",
            ],
            "//conditions:default": [
                "--env=canary=false",
            ],
        }),
        node_modules = ":node_modules",
        output_dir = True,
        webpack_config = ":webpack.config.js",
        deps = [
            ":node_modules/@datastructures-js/queue",
            ":node_modules/@lit-labs/motion",
            ":node_modules/@lit/localize",
            ":node_modules/@lit/localize-tools",
            ":node_modules/@material/banner",
            ":node_modules/@material/mwc-circular-progress",
            ":node_modules/@material/mwc-dialog",
            ":node_modules/@material/tooltip",
            ":node_modules/@material/web",
            ":node_modules/@stdlib/utils-escape-regexp-string",
            ":node_modules/@testing-library/dom",
            ":node_modules/@types/chrome",
            ":node_modules/@types/node",
            ":node_modules/@vitest/coverage-v8",
            ":node_modules/@vitest/eslint-plugin",
            ":node_modules/async-mutex",
            ":node_modules/copy-webpack-plugin",
            ":node_modules/css-loader",
            ":node_modules/dompurify",
            ":node_modules/eslint",
            ":node_modules/google-protobuf",
            ":node_modules/grpc-web",
            ":node_modules/html-webpack-plugin",
            ":node_modules/idb",
            ":node_modules/jsdom",
            ":node_modules/json5",
            ":node_modules/lit",
            ":node_modules/mini-css-extract-plugin",
            ":node_modules/path",
            ":node_modules/poll-until-promise",
            ":node_modules/prettier",
            ":node_modules/raw-loader",
            ":node_modules/sass",
            ":node_modules/sass-loader",
            ":node_modules/semver",
            ":node_modules/style-loader",
            ":node_modules/sw-xhr",
            ":node_modules/terser-webpack-plugin",
            ":node_modules/ts-loader",
            ":node_modules/typescript",
            ":node_modules/typescript-eslint",
            ":node_modules/vitest",
            ":node_modules/web-ext",
            ":node_modules/webpack",
            ":node_modules/webpack-cli",
            ":node_modules/webpack-preprocessor-loader",
            ":node_modules/webpack-shell-plugin-next",
        ],
        **kwargs
    )
