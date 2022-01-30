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

1. [Install Brew](https://brew.sh/) if not installed already.
1. Use Brew to install the following packages: `bash`, `gnu-getopt`, and
`gnu-sed`. Basically we want to get an updated bash version, an updated version
of the `getopt` command, and the GNU version of `sed`.
1. Set Brew's bash as the default shell (or just make sure to use Brew's bash
when compiling the extension).
1. Include the directories where `getopt` and `gnu-sed` were installed to
`$PATH`.
