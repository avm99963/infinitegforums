load("@npm//:@lit/localize-tools/package_json.bzl", "bin")

def lit_localize(name, operation, visibility = ["//visibility:private"]):
    if operation != "build" and operation != "extract":
        fail("lit_localize_run_binary was called with operation \"{}\", but the only allowed values are \"build\" and \"extract\".".format(operation))

    lit_localize_json_target = "//:{}_lit_localize_json".format(operation)

    bin.lit_localize(
        name = name,
        srcs = [
            Label(":interchange_files"),
            Label(":localized_code"),
            lit_localize_json_target,
            "//:node_modules/@lit",
            "//:node_modules/@lit/localize",
        ],
        args = [
            "--config=$(rootpath {})".format(lit_localize_json_target),
            operation,
        ],
        out_dirs = ["generated"] if operation == "build" else ["source_golden"],
        progress_message = "Building lit-locales files" if operation == "build" else "Extracting lit-locales messages",
        silent_on_success = True,
        visibility = visibility,
    )
