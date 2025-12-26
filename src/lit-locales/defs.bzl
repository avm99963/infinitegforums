load("@npm//:@lit/localize-tools/package_json.bzl", "bin")
load(":target_locales.bzl", "get_generated_files_list", "get_interchange_files_list", "target_locales")

def lit_localize(name, operation, visibility = ["//visibility:private"]):
    if operation != "build" and operation != "extract":
        fail("lit_localize_run_binary was called with operation \"{}\", but the only allowed values are \"build\" and \"extract\".".format(operation))

    lit_localize_json_target = "//:{}_lit_localize_json".format(operation)
    output_dir = _get_lit_localize_out_dir(operation)
    output_files = _get_lit_localize_outs(operation)

    run_lit_localize_cmd = "BAZEL_BINDIR=\"$(BINDIR)\" ./$(execpath {lit_localize}) \"--config=$(rootpath {config})\" {operation} 2> >(grep --invert-match \"using canonical text as fallback\")".format(
        lit_localize = "//src/lit-locales:lit_localize",
        config = lit_localize_json_target,
        operation = operation,
    )

    if operation == "build":
        cmds = [run_lit_localize_cmd]
    elif operation == "extract":
        cmds = [
            "install -m 644 $(execpaths {existing_xliff_files}) \"{out_xliff_dir}\"".format(
                existing_xliff_files = Label(":interchange_files"),
                out_xliff_dir = "$(RULEDIR)/" + output_dir,
            ),
            run_lit_localize_cmd,
        ]

    native.genrule(
        name = name,
        srcs = [
            Label(":interchange_files"),
            Label(":localized_code"),
            lit_localize_json_target,
            "//:node_modules/@lit",
            "//:node_modules/@lit/localize",
        ],
        outs = output_files,
        tools = ["//src/lit-locales:lit_localize"],
        cmd = "\n".join(cmds),
        message = "Building lit-locales files" if operation == "build" else "Extracting lit-locales messages",
        visibility = visibility,
    )

def _get_lit_localize_outs(operation):
    if operation == "build":
        return get_generated_files_list()
    elif operation == "extract":
        return get_interchange_files_list(
            directory = _get_lit_localize_out_dir(operation),
        )

def _get_lit_localize_out_dir(operation):
    if operation == "build":
        return "generated"
    elif operation == "extract":
        return "source_golden"
