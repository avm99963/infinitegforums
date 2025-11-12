# Set up the development environment
Before starting to develop, you must set up your device. Thanks to our move to
[Bazel][bazel], this is now easy peasy lemon squeezy :)

1. [Install Bazelisk][bazelisk-readme]. On Mac, you can install it with
   [Homebrew][homebrew].
1. Clone the git repository to your device to retrieve the extension source
   code. To do that, [go here][clone-page] and execute the "clone with
   commit-msg hook" command listed there (if you sign in you'll see several
   options: cloning via anonymous HTTP, HTTP, or SSH).
    - Alternatively (and I highly recommend this), use [JJ (Jujutsu)][jj]
      instead of Git. It's the easiest way to contribute to a Gerrit project
      thanks to its `jj gerrit upload` command. There is even a [guide on how
      to use JJ to contribute in Gerrit][jj-gerrit].
1. That's it! You can check if the build works correctly by running `bazel test
   //...`. This will build all targets and run all tests, which might take some
   time. After this, subsequent builds will be much faster thanks to caching!

[bazel]: https://bazel.build/
[bazelisk-readme]: https://github.com/bazelbuild/bazelisk/blob/master/README.md
[homebrew]: https://brew.sh/
[clone-page]: https://gerrit.avm99963.com/admin/repos/infinitegforums
[jj]: https://jj-vcs.github.io/jj/latest/
[jj-gerrit]: https://jj-vcs.github.io/jj/latest/gerrit/
