load("@aspect_rules_js//js:defs.bzl", "js_library")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

def common_ts_project(name, visibility, additional_ts_srcs = [], additional_js_library_srcs = [], **kwargs):
    """Compiles all non-test Typescript files and includes them as well as
non-test Javascript files in a js_library.

Args:
    additional_ts_srcs: additional sources to include in the ts_project.

    additional_js_library_srcs: additional sources to include in the js_library.

    **kwargs: args to pass to ts_project.
"""
    ts_project_target_name = "{}_ts_project".format(name)
    ts_project(
        name = ts_project_target_name,
        srcs = native.glob(
            [
                "**/*.ts",
            ],
            exclude = [
                "**/*.test.ts",
                "**/*.pre.ts",
            ],
            allow_empty = True,
        ) + additional_ts_srcs,
        visibility = ["//visibility:private"],
        **kwargs
    )

    js_library(
        name = name,
        srcs = [ts_project_target_name] +
               native.glob(
                   ["**/*.js"],
                   exclude = ["**/*.test.js", "**/*.pre.js"],
               ) + additional_js_library_srcs,
        visibility = visibility,
    )
