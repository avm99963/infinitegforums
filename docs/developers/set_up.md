# Set up the development environment
Before starting to develop, you must set up your device. This is what you must
do:

1. [Install Go](https://golang.org/doc/install). On Mac, you can install it
with [Homebrew](https://brew.sh/) by running `brew install go`.
   - This is because the build script uses a Go program to generate the
   manifest.
1. Install the genmanifest Go program. In order to do this, run
`go install gomodules.avm99963.com/webext/genmanifest@latest`.
1. [Install NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/).
1. Now, you must clone the git repository to your device to retrieve the
extension source code. To do that,
[go here](https://gerrit.avm99963.com/admin/repos/infinitegforums) and execute
the "clone with commit-msg hook" command listed there (if you sign in you'll see
several options: cloning via anonymous HTTP, HTTP, or SSH).
1. That's it! If you're using a Mac, you're out of luck, because you must
perform some more steps.

## Mac-specific configuration
On a Mac, you must also follow these steps:

TODO(Issue #18): add macOS steps
