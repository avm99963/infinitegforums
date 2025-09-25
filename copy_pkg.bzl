load("@aspect_bazel_lib//lib:copy_to_directory.bzl", "copy_to_directory")
load("//tools:static_styles.bzl", "get_static_styles_labels", "get_static_styles_replace_prefixes")

def copy_extension_package_to_directory(name, webpack_bundle, out):
    copy_to_directory(
        name = name,
        srcs = [
            webpack_bundle,
            "//src/icons",
            "//src/static",
            "//manifest",
        ] + get_static_styles_labels(),
        out = out,
        exclude_srcs_patterns = [
            "**/OWNERS",
            "**/*.bazel",
            "**/*.bzl",
        ],
        replace_prefixes = {
            "manifest": "",
            "src/icons/*": "icons",
            "src/static": "",
            "webpack_bundle": "",
        } | get_static_styles_replace_prefixes(),
    )
