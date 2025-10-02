load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

def common_ts_project(name, visibility = ["//visibility:private"], additional_srcs = [], deps = [], **kwargs):
    """Outputs a non-test js_library with all compiled Typescript files.

Args:
    additional_srcs: additional sources to include in the ts_project.

    **kwargs: args to pass to ts_project.
"""

    ts_project(
        name = name,
        srcs = native.glob(
            [
                "**/*.ts",
            ],
            exclude = [
                "**/*.test.ts",
                "**/*.pre.ts",
            ],
            allow_empty = True,
        ) + additional_srcs,
        deps = deps,
        visibility = visibility,
        **kwargs
    )
