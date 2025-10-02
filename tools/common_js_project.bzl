load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

def common_js_project(name, srcs = None, **kwargs):
    ts_project(
        name = name,
        srcs = srcs if srcs != None else native.glob(
            [
                "**/*.js",
                "**/*.mjs",
            ],
            exclude = [
                "**/*.test.js",
                "**/*.pre.js",
            ],
            allow_empty = True,
        ),
        allow_js = True,
        declaration = True,
        emit_declaration_only = True,
        source_map = True,
        transpiler = "tsc",
        tsconfig = "//:tsconfig_pkg_js",
        **kwargs
    )
