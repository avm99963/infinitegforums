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

## Build the extension continously
If you're developing the extension, you might want to load it into your browser
without having to constantly build it manually after each change. In order to
do that, you can run `make serve_chromium` or `make serve_gecko` depending on
the type of continuous build you want.

This will run bazel-watcher and continuously serve a fresh version of the
compiled extension at `dist`. You can load this folder in Chrome by going to
`chrome://extensions` and selecting "Load unpacked". In Firefox, follow [this
guide][firefox-unpacked-pkg].

Keep in mind that while the extension is continuously built, it is not
automatically being loaded into your browser. You'll have to reload the
extension manually (but at least you won't have to both build and reload it).

[firefox-unpacked-pkg]: https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/
