load("//tools:bazel/flags/bool.bzl", "create_bool_flag_rule")

EnableBulkCRsProvider = provider(
    doc = "Whether the bulk CRs functionality should be enabled.",
    fields = ["enable_bulk_crs"],
)
enable_bulk_crs = create_bool_flag_rule(
    provider_factory = lambda v: EnableBulkCRsProvider(enable_bulk_crs = v),
)
