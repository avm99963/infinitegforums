.PHONY: node_deps clean_dist deps clean_deps serve_chromium serve_chromium_mv3 serve_gecko release release_chromium_stable release_chromium_beta release_gecko_stable build_test_extension clean_releases clean

WEBPACK := ./node_modules/webpack-cli/bin/cli.js
RELEASE_SCRIPT := bash tools/release.bash

# The sed command and the third_party/google-protobuf-commonjs_strict folder are
# needed because of https://github.com/protocolbuffers/protobuf/issues/7778.
grpc_proto_gen:
	(cd src/killSwitch && \
		protoc -I=. --js_out=import_style=commonjs_strict:. api_proto/*.proto && \
		protoc -I. --grpc-web_out=import_style=commonjs,mode=grpcwebtext:. api_proto/*.proto && \
		(cd api_proto && \
			sed -i -E "s/require\('google-protobuf\//require('..\/..\/third_party\/google-protobuf-commonjs_strict\//" *_pb.js ))

node_deps:
	npm ci --no-save

clean_dist:
	rm -rf dist

deps: node_deps
	mkdir -p dist

clean_deps:
	rm -rf node_modules

serve_chromium: deps
	$(WEBPACK) --mode development --env browser_target=chromium --watch

serve_chromium_mv3: deps
	$(WEBPACK) --mode development --env browser_target=chromium_mv3 --watch

serve_gecko: deps
	$(WEBPACK) --mode development --env browser_target=gecko --watch

release: release_chromium_stable release_chromium_beta release_gecko_stable

release_chromium_stable: deps
	$(WEBPACK) --mode production --env browser_target=chromium
	$(RELEASE_SCRIPT) -c stable -b chromium
	rm -rf dist/chromium

release_chromium_beta: deps
	$(WEBPACK) --mode production --env browser_target=chromium_mv3
	$(RELEASE_SCRIPT) -c beta -b chromium_mv3
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

clean: clean_deps clean_dist clean_releases
