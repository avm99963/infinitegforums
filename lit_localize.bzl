load("@aspect_bazel_lib//lib:expand_template.bzl", "expand_template")

# These templates are used when Bazel builds and extracts messages. Webpack
# compilation still uses the legacy lit-localize.json file.
# TODO(https://iavm.xyz/b/twpowertools/256): remove lit-localize.json.

def expand_lit_localize_config_templates():
    expand_template(
        name = "build_lit_localize_json",
        out = "lit-localize.build.json",
        substitutions = {
            "{OUTPUT_DIR}": "./src/lit-locales/generated",
            "{SOURCE_DIR}": "./src/lit-locales/source",
        },
        template = Label("lit-localize.template.json"),
        visibility = ["//src/lit-locales:__subpackages__"],
    )
