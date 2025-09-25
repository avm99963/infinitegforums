#/usr/bin/env bash

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

source "$(rlocation _main/tools/release_utils.sh)"

function assert_equal() {
  local var_name=$1
  local expected=$2
  local actual=$3

  if [[ $actual != $expected ]]; then
    echo "FAIL: In test \"${test_name}\":"
    echo "FAIL:   RAW_GIT_VERSION=${RAW_GIT_VERSION}:" 2>&1
    echo "FAIL:   Expected: ${var_name}=${expected}" 2>&1
    echo "FAIL:   Instead, got: ${var_name}=${actual}" 2>&1
    return 1
  fi
}

function test_generate_version_vars() {
  # Test configuration
  local test_name=$1
  local RAW_GIT_VERSION=$2
  local CHANNEL=$3
  local expected_version=$4
  local expected_version_name=$5

  local VERSION
  local VERSION_NAME

  generate_version_vars

  assert_equal "VERSION" "$expected_version" "$VERSION"
  assert_equal "VERSION_NAME" "$expected_version_name" "$VERSION_NAME"
}

all_ok="1"

test_generate_version_vars "Stable releases" "v3.42.0" "stable" "3.42.0" "3.42.0-stable"
test_generate_version_vars "Beta releases" "v3.42.0" "beta" "3.42.0" "3.42.0-beta"
test_generate_version_vars "Canary releases" "v3.3.1-131-g95e7404" "canary" "3.3.1.131" "3.3.1.131-canary"
test_generate_version_vars "Local development" "v3.3.1-131-g95e7404" "stable" "0" "v3.3.1-131-g95e7404-stable"
test_generate_version_vars "Local development (dirty working copy)" "v3.3.1-131-g95e7404-dirty" "stable" "0" "v3.3.1-131-g95e7404-dirty-stable"

# The following tests are for cases that should not happen.
# But this behavior is set as a well-known fallback.
test_generate_version_vars "Fallback for local development" "g95e7404" "stable" "0" "g95e7404-stable"
test_generate_version_vars "Fallback for canary versions" "g95e7404" "canary" "0" "g95e7404-canary"

if [[ $all_ok != "1" ]]; then
  return 1
fi
