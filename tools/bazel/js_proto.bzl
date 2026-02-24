load(
    "@rules_proto_grpc//:defs.bzl",
    "ProtoPluginInfo",
    "proto_compile_attrs",
    "proto_compile_impl",
    "proto_compile_toolchains",
)

# Our own proto compile rule, based on
# https://github.com/rules-proto-grpc/rules_proto_grpc/blob/06ba25c15793bcb5d356957ff5c8feb854921a3e/modules/js/js_proto_compile.bzl.
#
# We use our own since we need to disable the ts plugin, because *.d.ts files
# generated for *.proto files that include a package don't match what the
# proto_plugin outputs (the package name is missing as a namespace).
#
# Fixing the Typescript declaration files generation is tracked at
# https://iavm.xyz/b/twpowertools/249.
#
# TODO(https://iavm.xyz/b/twpowertools/249): fix the Typescript generation by
# adapting this rule or by using the upstream js_proto_compile rule (maybe
# we're not using it appropriately or a new version fixes this issue).
js_proto_compile = rule(
    implementation = proto_compile_impl,
    attrs = dict(
        proto_compile_attrs,
        _plugins = attr.label_list(
            providers = [ProtoPluginInfo],
            default = [
                Label("@rules_proto_grpc_js//:proto_plugin"),
            ],
            cfg = "exec",
            doc = "List of protoc plugins to apply",
        ),
    ),
    toolchains = proto_compile_toolchains,
)
