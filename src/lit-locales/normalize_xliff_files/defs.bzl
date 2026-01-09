load("@aspect_rules_js//js:defs.bzl", "js_run_binary")

def normalize_xliff_files(name, srcs, outs, visibility = ["//visibility:private"]):
    if len(srcs) != len(outs):
        fail("srcs and outs should have the same length.")

    args = []
    for idx in range(len(srcs)):
        args.append("$(rootpath {})".format(srcs[idx]))
        args.append("$(rootpath {})".format(outs[idx]))

    js_run_binary(
        name = name,
        srcs = srcs,
        outs = outs,
        args = args,
        tool = Label(":normalize_xliff_files"),
        visibility = visibility,
    )
