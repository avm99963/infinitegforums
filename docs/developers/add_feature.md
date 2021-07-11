# Add a new feature
All the features are hidden behind a switch, so users can turn them on or off as
desired. This doc explains how to add this feature switch option to the options
page, and some guidance on where should the feature be developed.

## Add an option
Each feature has a boolean option "linked" to it, which determines whether the
feature will be enabled or not.

### How to add the feature switch option
1. First of all, think of a short codename for the feature.
2. Modify the `//src/common/optionsPrototype.json5` file by adding an entry.
    - All features should have the `false` value set as a default, so existing
    users have to explicitly enable the option after they receive the extension
    update. Otherwise, it might cause confusion, because users wouldn't know if
    the feature was added by the extension or Google.
3. Now, modify the `//src/static/options/options.html` file by appending the
following HTML code in the corresponding section:
    ```
    <div class="option"><input type="checkbox" id="{{codename}}"> <label for="{{codename}}" data-i18n="{{codename}}"></label> <span class="experimental-label" data-i18n="experimental_label"></span></div>
    ```
    where you should substitute `{{codename}}` with the codename you've chosen.
The _experimental_ label is optional and should only be used with features which
are unreliable (or could be at some point in the future) due to their nature.
4. Finally, add the option string at `//src/static/_locales/en/manifest.json`,
by adding the string under the `options_{{codename}}` key.

### How to add additional options for the feature
Apart from the feature switch option, additional options can be defined in order
to further customize the behavior of a feature.

This is not usually the case, and it is preferred that the number of options is
kept to a minimum so the extension is as simple as possible. In any case, this
section explains how to add them in case they are needed.

*** promo
As a source of inspiration, take a look at the Community Console dark mode
feature: apart from the feature switch option (`ccdarktheme`) it has 2
additional options associated with it:

- The `ccdarktheme_mode` option can be configured in the options page with a
selector, and determines whether the dark/light themes are set according to the
OS's dark mode setting, or whether the user is the one in charge of switching
between them by clicking a button/switch in the Community Console.
    - Note that this option is only applied when the feature switch is turned
    on.
- The `ccdarktheme_switch_enabled` option is used to save whether the user
manually enabled the dark theme or not by using the switch/button in the
Community Console.
    - It is only applied when `ccdarktheme_mode` is set to `switch` and the
    feature is enabled.
***

These are the steps which you should generally follow when adding additional
options:

1. Think of a codename for the additional option. It should be the feature
codename appended by an underscore and a suffix
(`{{feature_codename}}_{{suffix}}`).
2. Modify the following files:
    1. Add an entry for the option in the `//src/common/optionsPrototype.json5`
    file.
    2. Append the option's codename to the `//src/common/specialOptions.json5`
    file. This is so the option can be handled in a specific way when
    showing/saving it in the options page, or so it is handled outside of the
    options page.
3. If you want to handle the option from the options page, follow these steps:
    1. Modify the `//src/static/options/options.html` file to add the
    appropriate code which implements the option (usually in the same `.option`
    div as the feature switch).
        - Don't include text, only the HTML structure. If you add a `data-i18n`
        attribute to an HTML element, its contents will be replaced with the
        corresponding i18n string (for instance,
        `<span data-i18n="test"></span>` will be rendered as
        `<span data-i18n="test">Test</span>` if `Test` was the string defined
        with the key `options_test`).
    2. Modify the `//src/optionsCommon.js` file to add the following things:
        1. In the switch statement inside the save function, add a case to
        handle saving your additional option.
        2. In the switch statement inside the load event listener, add another
        case so your option is correctly set in the options page with the saved
        value.
    3. Add the corresponding i18n strings at
    `//src/static/_locales/en/manifest.json`.
4. If you want to handle the option outside of the options page, include an
empty case in both switches at `//src/optionsCommon.js`, so the option is not
handled there.

## Develop the feature
TODO(issue #32): Write this section.
