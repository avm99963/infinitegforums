.PHONY: node_deps clean_dist deps clean_deps lit_localize_extract lit_localize_build lit_localize_all serve_chromium_mv3 serve_gecko release release_chromium_stable release_chromium_beta release_chromium_canary release_gecko_stable build_test_extension clean_releases test clean trigger_nightly_build

WEBPACK := ./node_modules/webpack-cli/bin/cli.js
VITEST := pnpm exec vitest
RELEASE_SCRIPT := bash tools/release.bash

grpc_proto_gen:
	(cd src/killSwitch && \
		protoc -I=. --js_out=import_style=commonjs_strict:. api_proto/*.proto && \
		protoc -I. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. api_proto/*.proto)
	(cd src/workflows && \
		protoc -I=. --js_out=import_style=commonjs_strict:. proto/*.proto)

node_deps:
	pnpm install --frozen-lockfile

clean_dist:
	rm -rf dist

deps: node_deps
	mkdir -p dist

clean_deps:
	rm -rf node_modules

lit_localize_extract:
	npx lit-localize extract

lit_localize_build:
	npx lit-localize build

lit_localize_all: lit_localize_extract lit_localize_build

serve_chromium_mv3: deps
	$(WEBPACK) --mode development --env browser_target=chromium_mv3 --watch

serve_gecko: deps
	$(WEBPACK) --mode development --env browser_target=gecko --watch

release: release_chromium_stable release_chromium_beta release_gecko_stable

release_chromium_stable: deps
	$(WEBPACK) --mode production --env browser_target=chromium_mv3
	$(RELEASE_SCRIPT) -c stable -b chromium_mv3
	rm -rf dist/chromium_mv3

release_chromium_beta: deps
	$(WEBPACK) --mode production --env browser_target=chromium_mv3
	$(RELEASE_SCRIPT) -c beta -b chromium_mv3
	rm -rf dist/chromium_mv3

release_chromium_canary: deps
	$(WEBPACK) --mode production --env browser_target=chromium_mv3 --env canary
	$(RELEASE_SCRIPT) -c canary -b chromium_mv3
	rm -rf dist/chromium_mv3

release_gecko_stable: deps
	$(WEBPACK) --mode production --env browser_target=gecko
	$(RELEASE_SCRIPT) -c stable -b gecko
	rm -rf dist/gecko

# Target to build the extension for webext lint in the Zuul Check Pipeline.
build_test_extension: deps
	$(WEBPACK) --mode production --env browser_target=gecko
	$(RELEASE_SCRIPT) -c stable -b gecko

clean_releases:
	rm -rf out

test:
	$(VITEST)

clean: clean_deps clean_dist clean_releases

# Manually trigger the nightly build. It also makes sure the tracked master branch is up to update
trigger_nightly_build:
	git fetch
	zuul-client enqueue-ref --tenant gerrit --pipeline nightly-build --project infinitegforums --ref refs/heads/master --newrev $$(git rev-parse gerrit/master)
