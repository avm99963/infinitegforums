#!/bin/bash
set -u

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

JQ_RLOCATION="$1"
SOURCE_RELATIVE_PATH="$2"
shift 2

JQ_BIN=$(rlocation "$JQ_RLOCATION")

if [[ ! -x "$JQ_BIN" ]]; then
  echo "Error: jq binary not found or not executable at $JQ_BIN"
  exit 1
fi

source "$(rlocation _main/src/static/_locales/tools/extra_keys_utils.sh)"

if [[ -z "${BUILD_WORKSPACE_DIRECTORY:-}" ]]; then
  echo "Error: This script must be run with 'bazel run'"
  exit 1
fi

SOURCE_FILE="${BUILD_WORKSPACE_DIRECTORY}/${SOURCE_RELATIVE_PATH}"

for target_relative_path in "$@"; do
  target_file="${BUILD_WORKSPACE_DIRECTORY}/${target_relative_path}"

  if [[ ! -f "$target_file" ]]; then
    echo "Warning: Could not find source file at $target_file. Skipping."
    continue
  fi

  extra=$(get_extra_keys "$JQ_BIN" "$SOURCE_FILE" "$target_file")

  if [[ -n "$extra" ]]; then
    echo "Removing extra keys from $target_relative_path..."

    tmp=$(mktemp)
    "$JQ_BIN" -n \
      --slurpfile source "$SOURCE_FILE" \
      --slurpfile target "$target_file" \
      '$target[0] | with_entries(select(.key as $k | $source[0] | has($k)))' > "$tmp" \

    mv "$tmp" "$target_file"
  else
    echo "$target_relative_path is clean."
  fi
done
