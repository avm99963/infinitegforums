load("@aspect_bazel_lib//lib:copy_to_directory.bzl", "copy_to_directory")

def copy_extension_package_to_directory(name, webpack_bundle, out):
    copy_to_directory(
        name = name,
        srcs = [
            webpack_bundle,
        ],
        out = out,
        replace_prefixes = {
            "webpack_bundle": "",
        },
    )
