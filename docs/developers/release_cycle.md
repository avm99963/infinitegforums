# Release cycle
When the code in the `master` branch is considered to be stable, a release can
be made. This is the procedure:

1. Tag the last commit with a version number (in the format `vx`, where x is the
extension's [version number](https://developer.chrome.com/extensions/manifest/version)
for that release) by running `bash tagRelease.bash --version vx`. Note that the
tag must be pushed to Gerrit after being created.
2. [Build the extension](build.md) for both the stable and beta channels. This
will output a ZIP file for each release channel and each supported browser.

Afterwards, the release/build files must be submitted to the Chrome Web Store
and addons.mozilla.org.

## Submitting to the Chrome Web Store
1. [Upload both release files](https://developer.chrome.com/webstore/publish#upload-your-item)
to the Chrome Web Store, one for each release channel.
2. [Submit both releases](https://developer.chrome.com/webstore/publish#submit-your-item-for-publishing)
to be reviewed by the Chrome Web Store team, but in the case of the stable
channel uncheck the "Publish automatically after it has passed review" option.
3. Upload the beta release file to the
[GitHub releases page](https://github.com/avm99963/infinitegforums/releases)
under the newly created tag. Mark that release as a pre-release at GitHub.
4. Wait until the beta release is reviewed and approved by Google.
5. Test again the extension by using the beta channel. Check if the options have
been transfered correctly from version to version, and wait some days (for
instance between 3 and 5 days) to see if other people report issues with the
updated version.
6. If everything goes well, publish the update in the stable channel. The
updated version should have already been reviewed by the Chrome Web Store team
at this time.
7. Update the release file in the GitHub releases page by removing the beta
release file and uploading the stable release file. Also, remove the pre-release
label.

If during this process the release wasn't approved by Google or an issue was
found during beta testing, a new release which fixes this should be created and
the previous stable update should be canceled and superseded by the new release.

## Submitting to addons.mozilla.org
The procedure is similar to the one with the Chrome Web Store, except for the
fact that the stable version is directly uploaded to the store.

TODO(avm99963): Add more details here.
