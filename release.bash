#!/bin/bash

# Prints help text
function usage() {
  cat << END
  
  Usage: $progname [--channel CHANNEL]

  optional arguments:
    -h, --help     show this help message and exit
    -c, --channel  indicates the channel of the release. Can be "beta" or "stable".

END
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

if [[ $channel == "beta" ]]; then
  # Change manifest.json to label the release as beta
  sed -i 's/"name": "[^"]*"/"name": "__MSG_appNameBeta__"/' src/manifest.json
  sed -i -r 's/"version": "([^"]*)",/"version": "\1",\n  "version_name": "\1-beta",/' src/manifest.json
fi

# Create ZIP file for upload to the Chrome Web Store
mkdir -p out
rm -rf out/infinitegforums-$channel.zip
zip -rq out/infinitegforums-$channel.zip src -x *.git*

if [[ $channel == "beta" ]]; then
  # Revert manifest.json changes
  sed -i 's/"name": "[^"]*"/"name": "__MSG_appName__"/' src/manifest.json
  sed -i '/"version_name"/d' src/manifest.json
fi

echo "Done!"
