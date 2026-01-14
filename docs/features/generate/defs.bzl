load("@aspect_rules_js//js:defs.bzl", "js_run_binary")

def generate_features_docs(name, out, locale, visibility = ["//visibility:private"]):
    js_run_binary(
        name = name,
        outs = [out],
        args = ["$(rootpath {})".format(out), locale],
        tool = Label(":generate"),
        visibility = visibility,
    )
