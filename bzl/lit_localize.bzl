load("@aspect_bazel_lib//lib:expand_template.bzl", "expand_template")
load("//src/lit-locales:target_locales.bzl", "generated_locale_codes_file", "get_stringified_target_locales")

def expand_lit_localize_config_templates():
    stringified_target_locales = get_stringified_target_locales()

    expand_template(
        name = "build_lit_localize_json",
        out = "lit-localize.build.json",
        substitutions = {
            "{OUTPUT_DIR}": "./src/lit-locales/generated",
            "{SOURCE_DIR}": "./src/lit-locales/source",
            "{LOCALE_CODES_FILE}": generated_locale_codes_file,
            "[\"{TARGET_LOCALES}\"]": stringified_target_locales,
        },
        template = Label("lit-localize.template.json"),
        visibility = ["//src/lit-locales:__subpackages__"],
    )

    expand_template(
        name = "extract_lit_localize_json",
        out = "lit-localize.extract.json",
        substitutions = {
            "{OUTPUT_DIR}": "./src/lit-locales/generated",
            "{SOURCE_DIR}": "./src/lit-locales/source_golden",
            "{LOCALE_CODES_FILE}": generated_locale_codes_file,
            "[\"{TARGET_LOCALES}\"]": stringified_target_locales,
        },
        template = Label("lit-localize.template.json"),
        visibility = ["//src/lit-locales:__subpackages__"],
    )
