load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

def common_ts_project(include = [], exclude = [], **kwargs):
    """Runs ts_project for all non-test Typescript files in the package.

Args:
    include: additional files to include (list of glob expressions).

    exclude: additional files to exclude (list of glob expressions).

    **kwargs: args to pass to ts_project.
"""
    ts_project(
        srcs = native.glob(
            ["**/*.ts"] + include,
            exclude = ["**/*.test.ts"] + exclude,
        ),
        **kwargs
    )
