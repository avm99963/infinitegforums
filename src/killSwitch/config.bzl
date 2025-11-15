load("//tools:bazel/flags/bool.bzl", "create_bool_flag_rule")

EnableKillSwitchMechanismProvider = provider(
    doc = "Whether the extension should disable features when a kill switch is active.",
    fields = ["is_enabled"],
)
enable_kill_switch_mechanism = create_bool_flag_rule(
    provider_factory = lambda v: EnableKillSwitchMechanismProvider(is_enabled = v),
)
