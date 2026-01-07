BAZEL := bazel
IBAZEL := ibazel

.PHONY: node_deps
node_deps:
	pnpm install --frozen-lockfile

.PHONY: clean_dist
clean_dist:
	rm -rf dist

.PHONY: deps
deps: node_deps
	mkdir -p dist

.PHONY: clean_deps
clean_deps:
	rm -rf node_modules

.PHONY: lit_localize_extract
lit_localize_extract:
	@echo -e "\e[33mWARNING:\e[0m Calling make lit_localize_extract is deprecated."
	@echo "         Instead, run: bazel run //src/lit-locales:extract"
	bazel run //src/lit-locales:extract

.PHONY: serve_chromium
serve_chromium:
	$(IBAZEL) -run_command_after_success "./tools/copy_pkg_to_writeable_dir.sh" build --compilation_mode=fastbuild --//:browser=CHROMIUM --//:channel=STABLE unpacked_pkg

.PHONY: serve_gecko
serve_gecko:
	$(IBAZEL) -run_command_after_success "./tools/copy_pkg_to_writeable_dir.sh" build --compilation_mode=fastbuild --//:browser=GECKO --//:channel=STABLE unpacked_pkg

.PHONY: release
release: release_chromium_stable release_chromium_beta release_gecko

.PHONY: release_chromium_stable
release_chromium_stable:
	$(BAZEL) build --config=release --//:browser=CHROMIUM --//:channel=STABLE //:pkg_zip //:version_name
	mkdir -p out
	cp bazel-bin/twpowertools.zip out/twpowertools-chromium-stable-$$(cat bazel-bin/VERSION_NAME).zip

.PHONY: release_chromium_beta
release_chromium_beta:
	$(BAZEL) build --config=release --//:browser=CHROMIUM --//:channel=BETA //:pkg_zip //:version_name
	mkdir -p out
	cp bazel-bin/twpowertools.zip out/twpowertools-chromium-beta-$$(cat bazel-bin/VERSION_NAME).zip

.PHONY: release_chromium_canary
release_chromium_canary:
	$(BAZEL) build --config=release --//:browser=CHROMIUM --//:channel=CANARY //:pkg_zip //:version_name
	mkdir -p out
	cp bazel-bin/twpowertools.zip out/twpowertools-chromium-canary-$$(cat bazel-bin/VERSION_NAME).zip

.PHONY: release_gecko
release_gecko:
	$(BAZEL) build --config=release --//:browser=GECKO --//:channel=STABLE //:pkg_zip //:version_name
	mkdir -p out
	cp bazel-bin/twpowertools.zip out/twpowertools-gecko-stable-$$(cat bazel-bin/VERSION_NAME).zip

.PHONY: clean_releases
clean_releases:
	rm -rf out

.PHONY: test
test:
	$(BAZEL) test ...

.PHONY: clean
clean: clean_deps clean_dist clean_releases

# Manually trigger the nightly build. It also makes sure the tracked master branch is up to update
.PHONY: trigger_nightly_build
trigger_nightly_build:
	git fetch
	zuul-client enqueue-ref --tenant gerrit --pipeline nightly-build --project infinitegforums --ref refs/heads/master --newrev $$(git rev-parse gerrit/master)
