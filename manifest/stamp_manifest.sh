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
source $(rlocation _main/manifest/manifest_utils.sh)

CHANNEL=$1
BROWSER=$2
template=$3
MANIFEST_FILE=$4

RAW_GIT_VERSION=
if [ -n "${BAZEL_STABLE_STATUS_FILE-}" ]; then
  RAW_GIT_VERSION=$(sed --sandbox -n '0,/^STABLE_RAW_GIT_VERSION /{s/^STABLE_RAW_GIT_VERSION \(.*\)$/\1/p}' "${BAZEL_STABLE_STATUS_FILE}")
fi

if [[ $CHANNEL != "stable" && $CHANNEL != "beta" && $CHANNEL != "canary" ]]; then
  echo "ERROR: channel paramater value is incorrect." >&2
  return 1
fi

if [[ $BROWSER != "chromium_mv3" && $BROWSER != "gecko" ]]; then
  echo "ERROR: browser paramater value is incorrect." >&2
  return 1
fi

cp "$template" "$MANIFEST_FILE"

if [ -n "${RAW_GIT_VERSION-}" ]; then
  generate_version_vars
  set_manifest_field "version" "$VERSION"
  set_manifest_field "version_name" "$VERSION_NAME"
fi

set_other_manifest_fields
