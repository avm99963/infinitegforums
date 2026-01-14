load("@aspect_rules_js//js:defs.bzl", "js_run_binary")
load("@bazel_lib//lib:write_source_files.bzl", "write_source_files")
load("//docs/features/generate:defs.bzl", generate_features_docs_macro = "generate_features_docs")
load("//src/lit-locales:target_locales.bzl", "target_locales")

def generate_features_docs(name):
    files = {}

    locales = ["en"] + target_locales
    for locale in locales:
        extension = "." + locale + ".md"
        golden_file = "features_golden" + extension
        git_workspace_file = "features" + extension
        files[git_workspace_file] = golden_file

        generate_features_docs_macro(
            name = name + "_golden_" + locale,
            out = golden_file,
            locale = locale,
        )

    write_source_files(
        name = name,
        # We allow the features docs to be outdated with regards to the
        # currently defined features, since we don't want to make the CLs
        # uploaded by Weblate fail tests.
        #
        # Instead, we have added a step to the release cycle docs to make sure
        # that the docs are regenerated before release.
        diff_test = False,
        files = files,
        # This target should only be run with certain configs, so that the
        # features documents are well defined.
        target_compatible_with = select({
            Label(":can_write_features_docs"): [],
            "//conditions:default": ["//tools/platforms:incompatible"],
        }),
    )
