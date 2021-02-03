# Build the extension
A zip file with the contents of the extension, which can be uploaded to the
Chrome Web Store and addons.mozilla.org, can be created with any of the
following procedures (make sure to [install Go](https://golang.org) before
building the extension, as it is needed during the build):

## Using the release.bash script
Run `bash release.bash -h` in order to learn how to use this command. To
summarize, the command accepts the `--channel` and `--browser` flags (or their
short versions `-c` and `-b`).

As an example, if you wanted to create a ZIP file of the beta-branded extension
targeted for Firefox, you would run `bash release.bash -c beta -b gecko`.

## Using make
You can also use _make_ to build the extension. This is just a wrapper for the
`release.bash` command.

Run `make all` to build the extension for all the available channels and
browsers. You can also run `make {target}` where `{target}` is one of the
following: `chromium-stable`, `chromium-beta`, `chromium-mv3-beta`,
`gecko-stable`.

Run `make clean` to clean all the release files (this removes the `out` folder,
which is where the release files are saved).

## Load the extension "without" building it
If you're developing the extension, you might want to load it into your browser
without having to constantly build it after each change. In order to do that,
you'll only have to manually generate the manifest each time you change the
`template/manifest.gjson` file (or only once if you don't change it, and once
every time you pull new changes to your git clone).

In order to do that, run `go run generateManifest.go {browser}`, where
`{browser}` is `CHROMIUM`, `GECKO` or `CHROMIUM_MV3`, and this will generate the
`manifest.json` file for the specified browser in the `src` directory. Now, you
can load the `src` folder directly in the browser in order to import the
extension.

## About the _Chromium MV3_ target
Chromium is working in a
[new version of the manifest.json file](https://developer.chrome.com/docs/extensions/mv3/intro/),
which also introduces some changes to the extension APIs. Eventually, all Chrome
extensions will be required to have migrated to Manifest V3 (MV3), so in order
to anticipate this change, a new experimental _Chromium MV3_ target has been
added.

This target is experimental in the sense that it isn't actually used when
building the extension ZIPs which are uploaded to the Chrome Web Store (MV2 is
still used), and because these builds aren't currently being exhaustively
tested.
