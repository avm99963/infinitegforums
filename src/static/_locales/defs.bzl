locales = [
    "ar",
    "ca",
    "de",
    "en",
    "es",
    "fr",
    "in",
    "it",
    "ja",
    "ko",
    "nl",
    "pt-rBR",
    "ru",
    "tr",
    "vi",
]

# This is necessary because we continue to save locales with the Pontoon
# naming convention, even if we're now using Weblate.
#
# Thus, we need to convert the locale written with the Pontoon naming
# convention to the actual locale needed by browsers.
locale_overrides = [
    {
        "pontoon_locale": "pt-rBR",
        "web_ext_locale": "pt_BR",
    },
    {
        "pontoon_locale": "pt-rBR",
        "web_ext_locale": "pt_PT",
    },
]

overriden_locales = [
    override["pontoon_locale"]
    for override in locale_overrides
]

def get_non_overriden_locales():
    return [
        locale
        for locale in locales
        if locale not in overriden_locales
    ]

def get_overriden_locale_path_mappings():
    return [{
        "rule_name": "overriden_locales_{}".format(l["web_ext_locale"]),
        "old_directory": l["pontoon_locale"],
        "new_directory": l["web_ext_locale"],
    } for l in locale_overrides]
