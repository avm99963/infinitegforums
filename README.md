# TW Power Tools
[![Available in the Chrome Web Store](docs/resources/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/infinite-scroll-in-tw/hpgakoecmgibigdbnljgecablpipbajb)

An extension which brings several enhancements to the Google Forums and the
Community Console.

## Release cycle
When the code in the `master` branch is considered to be stable, a release can
be made. This is the procedure:

1. Tag the last commit with a version number (in the format `vx`, where x is the
extension's [version number](https://developer.chrome.com/extensions/manifest/version)
for that release) by running `bash tagRelease.bash --version vx`. Note that the
tag must be pushed to Gerrit after being created.
2. Build the extension for both the stable and beta channels (this is explained
in the next section). This will output a ZIP file for each release channel and
each supported browser.

Afterwards, the release/build files must be submitted to the Chrome Web Store
and addons.mozilla.org.

### Submitting to the Chrome Web Store
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
found during beta testing, a new release which fixes this should be created.

### Submitting to addons.mozilla.org
The procedure is similar to the one with the Chrome Web Store.

@TODO: Add more details once the first version of the extension has been
uploaded to addons.mozilla.org.

## Build the extension
A zip file with the contents of the extension, which can be uploaded to the
Chrome Web Store and addons.mozilla.org, can be created with any of the
following procedures (make sure to [install Go](https://golang.org) before
building the extension, as it is needed during the build):

### Using the release.bash script
Run `bash release.bash -h` in order to learn how to use this command. To
summarize, the command accepts the `--channel` and `--browser` flags (or their
short versions `-c` and `-b`).

As an example, if you wanted to create a ZIP file of the beta-branded extension
targeted for Firefox, you would run `bash release.bash -c beta -b gecko`.

### Using make
You can also use _make_ to build the extension. This is just a wrapper for the
`release.bash` command.

Run `make all` to build the extension for all the available channels and
browsers. You can also run `make {target}` where `{target}` is one of the
following: `chromium-stable`, `chromium-beta`, `gecko-stable`, `gecko-beta`.

Run `make clean` to clean all the release files (this removes the `out` folder,
which is where the release files are saved).

## Testing notes
When testing the extension during development, you don't have to build the
extension each time you want to import an updated version to Chrome/Firefox.
Instead, run `go run generateManifest.go {browser}` once, where `{browser}` is
either `CHROMIUM` or `GECKO`, and this will generate a `manifest.json` file for
the specified browser in the `src` directory. Now, you can load the `src` folder
directly in the browser in order to import the extension, which removes the need
to build it. When the `manifest.gjson` file is modified, you'll have to generate
the manifest again.

To test translations, you might want to set your browser's locale. This section
tells you how to set the locale in
[Windows](https://developer.chrome.com/extensions/i18n#testing-win),
[Mac OS X](https://developer.chrome.com/extensions/i18n#testing-mac),
[Linux](https://developer.chrome.com/extensions/i18n#testing-linux),
and [Chrome OS](https://developer.chrome.com/extensions/i18n#testing-chromeos).

## Beta channel
The beta channel for Chrome is available
[here](https://chrome.google.com/webstore/detail/infinite-scroll-in-tw-bet/memmklnkkhifmflmidnflfcdepamljef).
