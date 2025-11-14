def _string_option_impl(allowed_values, provider_factory):
    def _impl(ctx):
        raw_value = ctx.build_setting_value
        if raw_value not in allowed_values:
            fail(str(ctx.label) + " build setting allowed to take values {" +
                 ", ".join(allowed_values) +
                 "} but was set to unallowed value " + raw_value)
        return provider_factory(raw_value)

    return _impl

def create_string_flag_rule(allowed_values, provider_factory):
    return rule(
        implementation = _string_option_impl(
            allowed_values = allowed_values,
            provider_factory = provider_factory,
        ),
        build_setting = config.string(flag = True),
    )
