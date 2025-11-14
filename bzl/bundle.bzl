load("@aspect_rules_js//js:defs.bzl", "js_info_files")
load("@aspect_rules_webpack//webpack:defs.bzl", "webpack_bundle")

def extension_bundle(name, **kwargs):
    webpack_bundle(
        name = name,
        srcs = [
            "//src/bg",
            "//src/contentScripts",
            "//src/entryPoints/communityConsole/contentScripts/main",
            "//src/entryPoints/communityConsole/contentScripts/start",
            "//src/entryPoints/communityConsole/injections/handleInstall",
            "//src/entryPoints/communityConsole/injections/handleUpdate",
            "//src/entryPoints/communityConsole/injections/main",
            "//src/entryPoints/communityConsole/injections/start",
            "//src/entryPoints/twBasic/thread/start",
            "//src/features/workflows/presentation/templates",
            "//src/features/workflows/ui/components/manager",
            "//src/injections",
            "//src/options/old",
            "//src/options/presentation/scripts",
            "//src/options/presentation/templates",
            # TODO(https://iavm.xyz/b/twpowertools/256): Move this out of the static
            # folder.
            "//src/static:common_console_styles",
            "//src/ui/styles/mdc",
        ],
        node_modules = ":node_modules",
        output_dir = True,
        webpack_config = ":webpack.config.js",
        deps = [
            ":node_modules/css-loader",
            ":node_modules/html-webpack-plugin",
            ":node_modules/json5",
            ":node_modules/mini-css-extract-plugin",
            ":node_modules/path",
            ":node_modules/raw-loader",
            ":node_modules/sass",
            ":node_modules/sass-loader",
            ":node_modules/style-loader",
            ":node_modules/terser-webpack-plugin",
            ":node_modules/ts-loader",
            ":node_modules/webpack",
        ],
        **kwargs
    )
