#!/usr/bin/env bash
#
# Generate release files (ZIP archives of the extension source code).
#
# Precondition: webpack has already built the extension.
#
# NOTE: This is a legacy script. Bazel doesn't use it.
# TODO(https://iavm.xyz/b/twpowertools/256): Delete it.

set -uo pipefail
set -e

progname=$(basename "$0")

# Prints help text
function usage() {
  cat <<END

  Usage: $progname [--channel CHANNEL --browser BROWSER]

  optional arguments:
    -h, --help     show this help message and exit
    -c, --channel  indicates the channel of the release. Can be "beta",
                   "stable" or "canary". Defaults to "stable".
    -b, --browser  indicates the target browser for the release. Can be
                   "gecko" or "chromium_mv3".
                   Defaults to "chromium_mv3".

END
}

source "tools/release_utils.sh"
source "manifest/manifest_utils.sh"

# Get options
opts=$(getopt -l "help,channel:,browser:" -o "hc:b:" -n "$progname" -- "$@")
eval set -- "$opts"

CHANNEL=stable
BROWSER=chromium_mv3

while true; do
  case "${1-}" in
    -h | --help)
      usage
      exit
      ;;
    -c | --channel)
      CHANNEL="$2"
      shift 2
      ;;
    -b | --browser)
      BROWSER="$2"
      shift 2
      ;;
    *) break ;;
  esac
done

if [[ $CHANNEL != "stable" && $CHANNEL != "beta" && \
  $CHANNEL != "canary" ]]; then
  echo "channel parameter value is incorrect." >&2
  usage
  exit
fi

if [[ $BROWSER != "gecko" && $BROWSER != "chromium_mv3" ]]; then
  echo "BROWSER parameter value is incorrect." >&2
  usage
  exit
fi

echo "Started building release..."

MANIFEST_FILE="dist/$BROWSER/manifest.json"
RAW_GIT_VERSION="$(git describe --always --tags --dirty)"
generate_version_vars

set_manifest_field "version" "$VERSION"
set_manifest_field "version_name" "$VERSION_NAME"

set_other_manifest_fields

# Create ZIP file for upload to the Chrome Web Store
mkdir -p out
rm -rf out/twpowertools-$RAW_GIT_VERSION-$BROWSER-$CHANNEL.zip
(cd dist/$BROWSER &&
  zip -rq ../../out/twpowertools-$RAW_GIT_VERSION-$BROWSER-$CHANNEL.zip * -x "*/.git*" \
    -x "*/\.DS_Store" -x "*/OWNERS")

echo "Done!"
