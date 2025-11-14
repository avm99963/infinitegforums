def _bool_option_impl(provider_factory):
    def _impl(ctx):
        raw_value = ctx.build_setting_value
        if raw_value != False and raw_value != True:
            fail(str(ctx.label) +
                 " build setting should be a boolean, but was set to an unknown value \"" +
                 str(raw_value) + "\".")
        return provider_factory(raw_value)

    return _impl

def create_bool_flag_rule(provider_factory):
    return rule(
        implementation = _bool_option_impl(
            provider_factory = provider_factory,
        ),
        build_setting = config.bool(flag = True),
    )
