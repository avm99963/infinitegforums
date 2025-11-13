load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

def common_ts_project(name, visibility = ["//visibility:private"], srcs = None, deps = [], **kwargs):
    """Outputs a non-test js_library with all compiled Typescript files.

Args:
    srcs: additional sources to include in the ts_project.

    **kwargs: args to pass to ts_project.
"""

    ts_project(
        name = name,
        srcs = srcs if srcs != None else native.glob(
            [
                "**/*.ts",
            ],
            exclude = [
                "**/*.test.ts",
                "**/*.pre.ts",
            ],
            allow_empty = True,
        ),
        deps = deps,
        visibility = visibility,
        **kwargs
    )
