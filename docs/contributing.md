# Contributing to TW Power Tools
If you're here, thanks for your interest in contributing! There are many ways
you can contribute, and you don't need any technical background for most of
them, so don't feel shy! Any help, even if small, is very much appreciated.

[TOC]

## Make feature requests and report issues
If you have some fresh ideas or insight into how to make the extension better,
or you've found a bug (sorry!), you can create a new issue at the Monorail Issue
Tracker:

- https://bugs.avm99963.com/p/twpowertools/issues

If you're reporting a bug, please consider specifying your browser and version,
and maybe the JavaScript console logs (open the JavaScript console by pressing
`[ Ctrl ][ Shift ][ J ]`) for the page where the issue occurred.

## Contribute translations
If you speak a language other than English, you can help translate the UI to
your language! Just go to the following website and start translating:

- https://i18n.avm99963.com/engage/tw-power-tools/

Learn more in the [Translator guide](./localization/translator_guide.md).

## Beta test the extension
Releasing an update to the stable channel isn't always an easy task, because
bugs might make its way there.

That's why, before releasing new versions to the stable channel in the Chrome
Web Store, we test pre-release versions in 2 additional channels:

- [**Beta channel**][beta-cws]: some days before releasing a new release to the
  stable channel, we first publish it to the beta channel. This gives us a last
  chance to catch any bugs.
- [**Canary channel**][canary-cws]: if you're brave and want to try the latest
  of the latest, every night a new version is automatically uploaded to the
  Chrome Web Store with the latest changes. This allows you to use and test new
  features/fixes before they are released, and it will help us discover bugs
  before the new changes even reach the beta channel.

  This channel is special because it is the only one where experiments
  (features which are currently under development and not yet ready to launch)
  are available. To see a list of experiments and enable them, go to the
  options page and click the flask icon button.

While using these channels (and specially the canary channel) comes with the
risk of coming across bugs, those are usually minor, and you have the
opportunity of using newer features before everyone else! Also, volunteering to
test the extension and report bugs is essential to keeping the extension
bug-free.

*** note
**Note:** It isn't recommended to install two versions of the extension at the
same time, as you might end up with duplicate injected components or weird
results.
***

*** promo
To be able to install the Canary channel, you have to [join the Google
Group](https://groups.google.com/g/twpowertools-discuss) first (feel free to
send a request to join with a link to your forum profile!).
***

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

[beta-cws]: https://chrome.google.com/webstore/detail/infinite-scroll-in-tw-bet/memmklnkkhifmflmidnflfcdepamljef
[canary-cws]: https://chromewebstore.google.com/detail/tw-power-tools-canary/phefpbdhiknkamngjffpnebaemanmihf
