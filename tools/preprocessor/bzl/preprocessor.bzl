load("@aspect_bazel_lib//lib:run_binary.bzl", "run_binary")

def _preprocessor_impl(name, visibility, src, out, defined_dependencies):
    run_binary(
        name = name,
        tool = Label(":preprocessor"),
        srcs = [src],
        args = [
            "-source",
            "$(location {})".format(src),
            "-destination",
            "$(location {})".format(out),
            "--",
        ] + defined_dependencies,
        outs = [out],
        mnemonic = "Preprocessor",
        progress_message = "Preprocessing %{input}",
        visibility = visibility,
    )

preprocessor = macro(
    implementation = _preprocessor_impl,
    doc = "Macro to preprocess a file according to defined dependencies.",
    attrs = {
        "src": attr.label(
            mandatory = True,
            allow_single_file = True,
            configurable = False,
            doc = "File to preprocess",
        ),
        "out": attr.output(
            mandatory = True,
            doc = "Destination to save the preprocessed file",
        ),
        "defined_dependencies": attr.string_list(
            mandatory = True,
            doc = "Defined dependencies.",
        ),
    },
)
