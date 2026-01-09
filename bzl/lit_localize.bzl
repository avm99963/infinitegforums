load("@bazel_lib//lib:expand_template.bzl", "expand_template")
load("//src/lit-locales:defs.bzl", "generated_dir", "non_normalized_source_golden_dir", "source_dir")
load("//src/lit-locales:target_locales.bzl", "generated_locale_codes_file", "target_locales")

def expand_lit_localize_config_templates():
    target_locales = _get_target_locales()

    expand_template(
        name = "build_lit_localize_json",
        out = "lit-localize.build.json",
        substitutions = {
            "{OUTPUT_DIR}": "./src/lit-locales/{}".format(generated_dir),
            "{SOURCE_DIR}": "./src/lit-locales/{}".format(source_dir),
            "{LOCALE_CODES_FILE}": generated_locale_codes_file,
            "[\"{TARGET_LOCALES}\"]": target_locales,
        },
        template = Label("lit-localize.template.json"),
        visibility = ["//src/lit-locales:__subpackages__"],
    )

    expand_template(
        name = "extract_lit_localize_json",
        out = "lit-localize.extract.json",
        substitutions = {
            "{OUTPUT_DIR}": "./src/lit-locales/{}".format(generated_dir),
            "{SOURCE_DIR}": "./src/lit-locales/{}".format(non_normalized_source_golden_dir),
            "{LOCALE_CODES_FILE}": generated_locale_codes_file,
            "[\"{TARGET_LOCALES}\"]": target_locales,
        },
        template = Label("lit-localize.template.json"),
        visibility = ["//src/lit-locales:__subpackages__"],
    )

def _get_target_locales():
    return "[" + ", ".join([
        "\"" + locale.replace("\"", "\\\"") + "\""
        for locale in target_locales
    ]) + "]"
