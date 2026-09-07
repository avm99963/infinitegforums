# Build the extension

Building the extension is the process of transforming the source code into a
bundle that can be loaded into the browser to install it.

There are 2 ways to build the extension depending on your use case.

## Build the extension continuously (for developers)

Run `make serve_chromium` (for Chromium) or `make serve_gecko` (for Firefox). (iBazel required. *You installed it, right? Right?..*)

This is useful if you're developing the extension and want a fast way to
quickly test the changes you made to the source code to verify they work
correctly.

These commands will run bazel-watcher and continuously serve a fresh version of
the compiled extension at `dist` whenever you make changes to the source code.
You can load this folder in Chrome by going to `chrome://extensions` and
selecting "Load unpacked". In Firefox, follow [this
guide][firefox-unpacked-pkg].

Keep in mind that while the extension is continuously built, it is not
automatically being loaded into your browser. You'll have to reload the
extension manually whenever `dist` changes (but at least you won't have to both
build and reload it).

## Build the extension as a zip file (one-time)

Run `make release` to build the extension for all the available channels and
browsers. You can also run `make {target}` where `{target}` is one of the
following: `release_chromium_stable`, `release_chromium_beta`,
`release_gecko_stable`.

This is useful if you want to upload a new version to the Chrome Web Store or
addons.mozilla.org, or otherwise want to build the extension manually into a
`.zip` file.

Run `make clean_releases` to clean all the release files (this removes the
`out` folder, which is where the release files are saved).

[firefox-unpacked-pkg]: https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
