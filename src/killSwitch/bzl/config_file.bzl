load(":bzl/config.bzl", "KillSwitchHostProvider")

def _config_file_impl(ctx):
    host = ctx.attr.host[KillSwitchHostProvider].host
    ctx.actions.expand_template(
        template = ctx.file._template,
        output = ctx.outputs.out,
        substitutions = {
            "{KILL_SWITCH_HOST}": host.replace("\"", "\\\""),
        },
    )

config_file = rule(
    implementation = _config_file_impl,
    attrs = {
        "host": attr.label(
            doc = "Kill switch host configuration setting",
            mandatory = True,
            providers = [KillSwitchHostProvider],
        ),
        "out": attr.output(
            doc = "File to write",
            mandatory = True,
        ),
        "_template": attr.label(
            default = ":config.template.js",
            allow_single_file = True,
        ),
    },
)
