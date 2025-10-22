target_locales = [
    "ar",
    "ca",
    "de",
    "es",
    "fr",
    "id",
    "it",
    "ja",
    "ko",
    "nl",
    "pl",
    "pt_BR",
    "ru",
    "th",
    "tr",
    "vi",
]

generated_locale_codes_file = "locales.js"

def get_stringified_target_locales():
    return "[" + ", ".join([
        "\"" + locale.replace("\"", "\\\"") + "\""
        for locale in target_locales
    ]) + "]"

def get_interchange_files_list(directory = ""):
    return [
        get_interchange_file_path(locale, directory)
        for locale in target_locales
    ]

def get_interchange_file_path(locale, directory = ""):
    return "{directory}{locale}.xlf".format(
        directory = directory + "/" if directory != "" else "",
        locale = locale,
    )

def get_generated_files_list():
    return [
        get_generated_file_path(locale)
        for locale in target_locales
    ] + ["generated/{}".format(generated_locale_codes_file)]

def get_generated_file_path(locale):
    return "generated/{}.js".format(locale)
