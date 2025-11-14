load("//tools:bazel/flags/bool.bzl", "create_bool_flag_rule")
load("//tools:bazel/flags/string.bzl", "create_string_flag_rule")

BrowserProvider = provider(
    doc = "Browser family to build the extension for. It's necessary to tailor builds for each browser since each one has a different set of APIs.",
    fields = ["browser"],
)
browser = create_string_flag_rule(
    allowed_values = ["CHROMIUM", "GECKO"],
    provider_factory = lambda v: BrowserProvider(browser = v),
)

ChannelProvider = provider(
    doc = "Channel to build the extension for.",
    fields = ["channel"],
)
channel = create_string_flag_rule(
    allowed_values = ["STABLE", "BETA", "CANARY"],
    provider_factory = lambda v: ChannelProvider(channel = v),
)

ReleaseProvider = provider(
    doc = """Whether the current build is destined to be released.

This changes some behavior in the extension, such as hiding the link to the experiments page.""",
    fields = ["is_release"],
)
release = create_bool_flag_rule(
    provider_factory = lambda v: ReleaseProvider(is_release = v),
)
