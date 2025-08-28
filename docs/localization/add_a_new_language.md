# How to add a new language

Adding a new language to the extension involves performing the following:

- In Weblate:
    1. Add the language in Weblate for all components except for the Lit
       strings component (you might not have permission to do this---in this
       case, contact a [committer][committer]).
    1. Add a translation for the messages regarding the extension name (even if
       it's the English name). Otherwise, the upload might not succeed in the
       Chrome Web Store.
- In the extension source code:
    1. Add the language code to `targetLocales` in `lit-localize.json`.
    1. Generate the XLIFF interchange file for that language (run `bazel run
       //src/lit-locales:extract`).
    1. Add the language to the `LANGUAGE_TRANSFORMATIONS` mapping in
       `tools/syncTranslations/config.ts`, and sync the translations via `bazel
       run //tools/syncTranslations`.

[committer]: ./translator_guide.md#roles
