# Infinite scroll in TW
[![Available in the Chrome Web Store](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_206x58.png)](https://chrome.google.com/webstore/detail/infinite-scroll-in-tw/hpgakoecmgibigdbnljgecablpipbajb)

## Release cycle
When the code in the `master` branch is considered to be stable, a release can be made. This is the procedure:

1. Tag the last commit with a version number (in the format `vx`, where x is the extension's [version number](https://developer.chrome.com/extensions/manifest/version) for that release) by running `git tag -a vx -m "vx"`. Note that the tag should be an annotated tag and not a lightweight tag, and it must be pushed to Gerrit after being created.
2. Build the extension for both the stable and beta channels (this is explained in the next section). This will output a ZIP file for each release channel.
3. [Upload both release files](https://developer.chrome.com/webstore/publish#upload-your-item) to the Chrome Web Store, one for each release channel.
4. [Submit both releases](https://developer.chrome.com/webstore/publish#submit-your-item-for-publishing) to be reviewed by the Chrome Web Store team, but in the case of the stable channel uncheck the "Publish automatically after it has passed review" option.
5. Upload the beta release file to the [GitHub releases page](https://github.com/avm99963/infinitegforums/releases) under the newly created tag. Mark that release as a pre-release at GitHub.
6. Wait until the beta release is reviewed and approved by Google.
7. Test again the extension by using the beta channel. Check if the options have been transfered correctly from version to version, and wait some days (for instance between 3 and 5 days) to see if other people report issues with the updated version.
8. If everything goes well, publish the update in the stable channel. The updated version should have already been reviewed by the Chrome Web Store team at this time.
9. Update the release file in the GitHub releases page by removing the beta release file and uploading the stable release file. Also, remove the pre-release label.

If during this process the release wasn't approved by Google or an issue was found during beta testing, a new release which fixes this should be created.

## Build the extension
To create a zip file with the contents of the extension, which can be uploaded to the Chrome Web Store, run `bash release.bash`. You can also use `bash release.bash --channel=beta` to include a beta label in the extension name and version of the resulting zip file.

The ZIP file will contain a manifest.json file with the according version name, and will be located in the `out` folder.

You can also get information about how to use the `release.bash` script by running `bash release.bash -h`.

## Testing notes
To test translations, you might want to set your browser's locale. This section tells you how to set the locale in [Windows](https://developer.chrome.com/extensions/i18n#testing-win), [Mac OS X](https://developer.chrome.com/extensions/i18n#testing-mac), [Linux](https://developer.chrome.com/extensions/i18n#testing-linux), and [Chrome OS](https://developer.chrome.com/extensions/i18n#testing-chromeos).

## Beta channel
The beta channel is available [here](https://chrome.google.com/webstore/detail/infinite-scroll-in-tw-bet/memmklnkkhifmflmidnflfcdepamljef).
