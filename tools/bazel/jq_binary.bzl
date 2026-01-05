def _jq_binary_impl(ctx):
    toolchain = ctx.toolchains["@jq.bzl//jq/toolchain:type"]

    jq_bin = toolchain.jqinfo.bin

    return [DefaultInfo(
        files = depset([jq_bin]),
        runfiles = ctx.runfiles(files = [jq_bin]),
    )]

jq_binary = rule(
    implementation = _jq_binary_impl,
    toolchains = ["@jq.bzl//jq/toolchain:type"],
)
