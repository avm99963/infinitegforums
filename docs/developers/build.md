# Build the extension
A zip file with the contents of the extension, which can be uploaded to the
Chrome Web Store and addons.mozilla.org, can be created by following these
instructions. (make sure to [install Go](https://golang.org) before building the
extension, as it is needed during the build).

The last section explains how to build the extension automatically when you
change the source code.

## Build the extension as a zip file
Run `make release` to build the extension for all the available channels and
browsers. You can also run `make {target}` where `{target}` is one of the
following: `release_chromium_stable`, `release_chromium_beta`,
`release_gecko_stable`.

Run `make clean_releases` to clean all the release files (this removes the `out`
folder, which is where the release files are saved).

Take a look at `Makefile`, you'll find other targets for _make_ which do other
interesting things (like `clean`, for instance).

## Build the extension continously with webpack development mode
If you're developing the extension, you might want to load it into your browser
without having to constantly build it manually after each change. In order to do
that, you can run `make serve_chromium`, `make serve_chromium_mv3` or
`make serve_gecko` depending on the type of continuous build you want.

This will run webpack with watch mode and continuously serve a fresh version of
the compiled extension at `dist/{BROWSER}`, where `{BROWSER}` depends on the
target you selected for _make_. You can load this folder in Chrome by going to
`chrome://extensions` and selecting "Load unpacked".

Keep in mind that while the extension is continuously built, it is not
automatically being loaded into Chrome. You'll have to reload the extension
manually in Chrome (but at least you won't have to both build and reload it).

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
