# Release cycle
When the code in the `master` branch is considered to be stable, a release can
be made. This is the procedure:

1. Tag the last commit with a version number (in the format `vx`, where x is the
extension's [version number](https://developer.chrome.com/extensions/manifest/version)
for that release) by running `bash tagRelease.bash --version vx`. Note that the
tag must be pushed to Gerrit after being created.
2. [Build the extension](build.md) for both the stable and beta channels. This
will output a ZIP file for each release channel and each supported browser.

Afterwards, the release should be published in GitHub along with a changelog,
a notice should be published in the private extension Google Group, and the
release/build files must be submitted to the Chrome Web Store and
addons.mozilla.org.

## Create release at GitHub
1. Go to https://github.com/avm99963/infinitegforums/releases.
2. Click the newly created tag and click **Edit tag**.
3. Fill in the description with the changelog. You can use this as a template:
``` md
## Changes

**Complete git changelog:**
https://gerrit.avm99963.com/plugins/gitiles/infinitegforums/+log/refs/tags/{previous_version}..refs/tags/{new_version}?pretty=full

### Summary of changes:

- abcdef0 Commit example 1

  This is a description of the commit, which explains more about what it does.

  Fixes: #42

- 41d1aff Convert dark mode to green mode
- 52dbca8 Introduce lollipops

  **Note:** This feature is not yet ready for launch and not available yet
  inside the options section.
```
4. Upload the Chromium stable and Gecko stable release files (alternatively
upload the Chromium beta and Gecko stable packages and mark the release as a
pre-release if there is no intention of promoting this release to stable in the
future).
5. Mark the option **Create a discussion for this release** and select category
**Releases**.
6. Click **Publish release**.
7. Click **Join release discussion**.
8. Add something like this to the beginning of the discussion:
``` md
# Version 1.9.3

## Status

- **Beta channel:** pending review. It will probably take some hours to be reviewed and automatically
published.
- **Stable channel:** it will be available by the end of the week.
```

## Submitting to the Chrome Web Store
1. [Upload both release files](https://developer.chrome.com/webstore/publish#upload-your-item)
to the Chrome Web Store, one for each release channel.
2. [Submit both releases](https://developer.chrome.com/webstore/publish#submit-your-item-for-publishing)
to be reviewed by the Chrome Web Store team, but in the case of the stable
channel uncheck the "Publish automatically after it has passed review" option.

## Submitting to addons.mozilla.org
The procedure is similar to the one with the Chrome Web Store, except for the
fact that the stable version is directly uploaded to the store.

You can upload the new version using the following link:
https://addons.mozilla.org/en-US/developers/addon/tw-power-tools/versions/submit/.

## Promoting the beta release to stable
After the beta release is reviewed and approved by Google, the following should
be done:

1. Test again the extension by using the beta channel. Check if the options have
been transfered correctly from version to version, and wait some days (for
instance between 3 and 5 days) to see if other people report issues with the
updated version.
2. If everything goes well, publish the update in the stable channel. The
updated version should have already been reviewed by the Chrome Web Store team
at this time.

If during this process the release wasn't approved by Google or an issue was
found during beta testing, a new release which fixes this should be created and
the previous stable update should be canceled and superseded by the new release.
