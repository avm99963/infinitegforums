#!/bin/bash

# Prints help text
function usage {
  cat << END

  Usage: $progname [--channel CHANNEL]

  optional arguments:
    -h, --help     show this help message and exit
    -c, --channel  indicates the channel of the release. Can be "beta" or "stable".

END
}

# Updates manifest.json field
function set_manifest_field {
  sed -i -E "s/\"$1\": \"[^\"]*\"/\"$1\": \"$2\"/" src/manifest.json
}

# Get options
opts=$(getopt -l "help,channel:" -o "hc:" -n "$progname" -- "$@")
eval set -- "$opts"

channel=stable

while true; do
  case "$1" in
    -h | --help ) usage; exit; ;;
    -c | --channel ) channel="$2"; shift 2 ;;
    * ) break ;;
  esac
done

if [[ $channel != "stable" && $channel != "beta" ]]; then
  echo "channel parameter value is incorrect."
  usage
  exit
fi

echo "Started building release..."

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
fi

# Create ZIP file for upload to the Chrome Web Store
mkdir -p out
rm -rf out/infinitegforums-$version-$channel.zip
zip -rq out/infinitegforums-$version-$channel.zip src -x *.git*

# Revert manifest.json changes
set_manifest_field "version" "0"
set_manifest_field "version_name" "dirty"
if [[ $channel == "beta" ]]; then
  set_manifest_field "name" "__MSG_appName__"
fi

echo "Done!"
