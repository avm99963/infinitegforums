def _string_option_impl(allowed_values, provider_factory):
    def _impl(ctx):
        raw_value = ctx.build_setting_value
        if raw_value not in allowed_values:
            fail(str(ctx.label) + " build setting allowed to take values {" +
                 ", ".join(allowed_values) +
                 "} but was set to unallowed value " + raw_value)
        return provider_factory(raw_value)

    return _impl

BrowserProvider = provider(
    doc = "Browser family to build the extension for. It's necessary to tailor builds for each browser since each one has a different set of APIs.",
    fields = ["browser"],
)
browsers = ["CHROMIUM", "GECKO"]
browser = rule(
    implementation = _string_option_impl(
        allowed_values = browsers,
        provider_factory = lambda v: BrowserProvider(browser = v),
    ),
    build_setting = config.string(flag = True),
)

ChannelProvider = provider(
    doc = "Channel to build the extension for.",
    fields = ["channel"],
)
channels = ["STABLE", "BETA", "CANARY"]
channel = rule(
    implementation = _string_option_impl(
        allowed_values = channels,
        provider_factory = lambda v: ChannelProvider(channel = v),
    ),
    build_setting = config.string(flag = True),
)

def _bool_option_impl(provider_factory):
    def _impl(ctx):
        raw_value = ctx.build_setting_value
        if raw_value != False and raw_value != True:
            fail(str(ctx.label) +
                 " build setting should be a boolean, but was set to an unknown value \"" +
                 str(raw_value) + "\".")
        return provider_factory(raw_value)

    return _impl

ReleaseProvider = provider(
    doc = """Whether the current build is destined to be released.

This changes some behavior in the extension, such as hiding the link to the experiments page.""",
    fields = ["is_release"],
)
release = rule(
    implementation = _bool_option_impl(
        provider_factory = lambda v: ReleaseProvider(is_release = v),
    ),
    build_setting = config.bool(flag = True),
)
