#!/usr/bin/env bash

# --- begin runfiles.bash initialization v3 ---
# Copy-pasted from the Bazel Bash runfiles library v3.
set -uo pipefail; set +e; f=bazel_tools/tools/bash/runfiles/runfiles.bash
# shellcheck disable=SC1090
source "${RUNFILES_DIR:-/dev/null}/$f" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "${RUNFILES_MANIFEST_FILE:-/dev/null}" | cut -f2- -d' ')" 2>/dev/null || \
  source "$0.runfiles/$f" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$0.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
  source "$(grep -sm1 "^$f " "$0.exe.runfiles_manifest" | cut -f2- -d' ')" 2>/dev/null || \
  { echo>&2 "ERROR: cannot find $f"; exit 1; }; f=; set -e
# --- end runfiles.bash initialization v3 ---

source $(rlocation _main/tools/release_utils.sh)

CHANNEL=$1
BROWSER=$2
FILE_NAME=$3

if [[ $CHANNEL != "stable" && $CHANNEL != "beta" && $CHANNEL != "canary" ]]; then
  echo >&2 "ERROR: channel paramater value is incorrect."
  exit 1
fi

if [[ $BROWSER != "chromium_mv3" && $BROWSER != "gecko" ]]; then
  echo >&2 "ERROR: browser paramater value is incorrect."
  exit 1
fi

generate_raw_git_version_var

if [ -n "${RAW_GIT_VERSION-}" ]; then
  generate_version_vars
else
  VERSION_NAME=dirty
fi


echo $VERSION_NAME > $FILE_NAME
