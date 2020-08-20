#!/bin/bash
#
# Generate release files (ZIP archives of the extension source code).

# Prints help text
function usage() {
  cat <<END

  Usage: $progname [--channel CHANNEL]

  optional arguments:
    -h, --help     show this help message and exit
    -c, --channel  indicates the channel of the release. Can be "beta"
                   or "stable". Defaults to "stable".
    -b, --browser  indicates the target browser for the release. Can be
                   "chromium" or "gecko". Defaults to "chromium".

END
}

# Updates manifest.json field
function set_manifest_field() {
  sed -i -E "s/\"$1\": \"[^\"]*\"/\"$1\": \"$2\"/" src/manifest.json
}

# Get options
opts=$(getopt -l "help,channel:,browser:" -o "hc:b:" -n "$progname" -- "$@")
eval set -- "$opts"

channel=stable
browser=chromium

while true; do
  case "$1" in
    -h | --help)
      usage
      exit
      ;;
    -c | --channel)
      channel="$2"
      shift 2
      ;;
    -b | --browser)
      browser="$2"
      shift 2
      ;;
    *) break ;;
  esac
done

if [[ $channel != "stable" && $channel != "beta" ]]; then
  echo "channel parameter value is incorrect." >&2
  usage
  exit
fi

if [[ $browser != "chromium" && $browser != "gecko" ]]; then
  echo "browser parameter value is incorrect." >&2
  usage
  exit
fi

echo "Started building release..."

# First of all, generate the appropriate manifest.json file for the
# target browser
dependencies=(${browser^^})

bash generateManifest.bash "${dependencies[@]}"

# This is the version name which git gives us
version=$(git describe --always --tags --dirty)

# If the version name contains a hyphen then it isn't a release
# version. This is also the case if it doesn't start with a "v".
if [[ $version == *"-"* || $version != "v"* ]]; then
  # As it isn't a release version, setting version number to 0 so it
  # cannot be uploaded to the Chrome Web Store
  set_manifest_field "version" "0"
  set_manifest_field "version_name" "$version-$channel"
else
  # It is a release version, set the version fields accordingly.
  set_manifest_field "version" "${version:1}"
  set_manifest_field "version_name" "${version:1}-$channel"
fi

if [[ $channel == "beta" ]]; then
  # Change manifest.json to label the release as beta
  set_manifest_field "name" "__MSG_appNameBeta__"

  if [[ $browser == "gecko" ]]; then
    # Change the extension ID
    set_manifest_field "id" "twpowertools+beta@avm99963.com"
  fi
else
  if [[ $browser == "gecko" ]]; then
    set_manifest_field "name" "__MSG_appNameGecko__"
  fi
fi

# Create ZIP file for upload to the Chrome Web Store
mkdir -p out
rm -rf out/twpowertools-$version-$browser-$channel.zip
(cd src &&
  zip -rq ../out/twpowertools-$version-$browser-$channel.zip * -x *.git*)

# Clean generated manifest.json file
rm -f src/manifest.json

echo "Done!"
