# Add a new feature

Each feature is developed in a new folder under the `//src/features` folder.
All features are hidden behind a switch, so users can turn them on or off as
desired.

## Add an option
Each feature has a boolean option "linked" to it, which determines whether the
feature will be enabled or not.

### How to add the feature switch option
1. First of all, think of a short codename for the feature.
2. Modify the `//src/common/options/optionsPrototype.ts` file (the file which
   holds the schema/prototype for the options object saved for each user) by
   adding an entry.
    - All features should have the `false` value set as a default, so existing
      users have to explicitly enable the option after they receive the
      extension update. Otherwise, it might cause confusion, because users
      wouldn't know if the feature was added by the extension or Google.
3. As mentioned, create a folder `//src/features/{{feature}}` where the name is
   the short codename converted to camel case.
4. Create a new package `presentation/options` under the newly created feature
   folder, and define the option you created in step 2 (see how it is done for
   the other features). This will be used for the option to be shown in the
   options page.
5. Go to `//src/options/presentation/data/featureCategories.ts`, and add the
   new feature to the appropriate category where you want to show it.

### How to add additional options for the feature
Apart from the feature switch option, additional options can be defined in
order to further customize the behavior of a feature.

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
- The `ccdarktheme_switch_status` option is used to save whether the user
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
2. Add an entry for the option in the
   `//src/common/options/optionsPrototype.ts` file.
3. If you want to handle the option from the options page, add it to the
   `subOptions` field in the `Feature` defined under the
   `//src/features/{{feature}}/presentation/options` folder.

## Develop the feature
TODO(issue #32): Write this section.

For now, you can read the [extension's architecture][architecture] doc and
check out the code for other features. Some good examples:

- A simple feature: [linkDialogFix][linkDialogFix].
- Features that leverage the new architecture: [bulkMove][bulkMove],
  [bulkReportReplies][bulkReportReplies].

[architecture]: ./architecture.md
[linkDialogFix]: ../../src/features/linkDialogFix
[bulkMove]: ../../src/features/bulkMove
[bulkReportReplies]: ../../src/features/bulkReportReplies
