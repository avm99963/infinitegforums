# Contributing to TW Power Tools
If you're here, thanks for your interest in contributing! There are many ways
you can contribute, and you don't need any technical background for most of
them, so don't feel shy! Any help, even if small, is very much appreciated.

## Make feature requests and report issues
If you have some fresh ideas or insight into how to make the extension better,
or you've found a bug (sorry!), you can create a new issue at the Monorail Issue
Tracker:

- https://bugs.avm99963.com/p/twpowertools/issues

Old issues are still hosted in GitHub, while new ones are hosted in Monorail.
You can view the old ones here:

- https://www.github.com/avm99963/infinitegforums/issues

If you're reporting a bug, please consider specifying your browser and version,
and maybe the Javascript console logs (open the Javascript console by pressing
`[ Ctrl ][ Shift ][ J ]`) for the page where the issue occurred.

## Contribute translations
If you speak a language other than English, you can help translate the UI to
your language! Just go to the following website and start translating:

- https://i18n.avm99963.com/engage/tw-power-tools/

Learn more in the [Translator guide](./localization/translator_guide.md).

## Beta test the extension
Releasing an update to the stable channel isn't always an easy task, because
bugs might make its way. As new release candidates are tested in the beta
channel before being promoted to the stable channel, this gives us a last chance
to catch any bugs before the release. This is why it's essential that some
people volunteer to beta test the extension.

While using the beta version comes with the risk of coming across bugs, those
are usually minor, and you have the opportunity of using newer features before
everyone else!

*** note
**Note:** It isn't recommended to install two versions of the extension at the
same time, as you might end up with duplicate injected components or weird
results.
***

You can install the beta channel here:

- https://chrome.google.com/webstore/detail/infinite-scroll-in-tw-bet/memmklnkkhifmflmidnflfcdepamljef

### Canary channel
If you're brave and want to try the latest of the latest, each night a new
version is automatically uploaded to the Chrome Web Store with the latest
changes which have been uploaded to the codebase. Be warned that it might not
work correctly!

- https://chromewebstore.google.com/detail/tw-power-tools-canary/phefpbdhiknkamngjffpnebaemanmihf

To be able to install the Canary channel, you have to
[join the Google Group](https://groups.google.com/g/twpowertools-discuss)
first (feel free to send a request to join!).

This channel is special because it is the only one where experiments (features
which are currently under development and not yet ready to launch) are
available. To see a list of experiments and enable them, go to the options page
and click the flask icon button.

## Contribute code changes
If you're a developer and you'd like to contribute code changes, please feel
free to do so!

You can get started by reading the following docs:

- [Set up the development environment](developers/set_up.md)
- [Build the extension](developers/build.md)
- [Add a new feature](developers/add_feature.md)
- [Extension's architecture](developers/architecture.md)
- [Submit changes for review](https://gerrit.avm99963.com/Documentation/intro-gerrit-walkthrough-github.html)
- [How to test translations](https://developer.chrome.com/docs/extensions/reference/i18n/#how-to-set-browsers-locale)

If you need any help, mentoring or anything else, send me an email at
`hi [at] avm99963.com` or create a thread in the
[Google group](https://groups.google.com/g/twpowertools-discuss).
I will be more than happy to help you :)

You can get a list of open issues which are recommended for first-time
contributors here:

- https://bugs.avm99963.com/p/twpowertools/issues/list?q=label%3AGoodFirstIssue

These issues will let you get familiar with the codebase and are not too
difficult to implement.

You can also assign yourself any of the open issues which haven't been assigned:

- https://bugs.avm99963.com/p/twpowertools/issues/list?q=status%3ANew%20OR%20status%3AAccepted

For your information, the following doc contains a description of the release
cycle for this extension, and how it is performed by its maintainers:

- [Release cycle](developers/release_cycle.md)
