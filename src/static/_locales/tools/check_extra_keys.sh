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
SOURCE_RLOCATION="$2"
shift 2

JQ_BIN=$(rlocation "$JQ_RLOCATION")
SOURCE_FILE=$(rlocation "$SOURCE_RLOCATION")

if [[ ! -x "$JQ_BIN" ]]; then
  echo "Error: jq binary not found or not executable at $JQ_BIN"
  exit 1
fi

source "$(rlocation _main/src/static/_locales/tools/extra_keys_utils.sh)"

has_error=0

for target_rlocation in "$@"; do
  target_file=$(rlocation "$target_rlocation")
  if [[ ! -f "$target_file" ]]; then
    echo "Error: Target file not found at $target_file"
    has_error=1
    continue
  fi

  extra=$(get_extra_keys "$JQ_BIN" "$SOURCE_FILE" "$target_file")
  if [[ -n "$extra" ]]; then
    echo "Error: Found extra keys in $target_rlocation:"

    # Count lines
    line_count=$(echo "$extra" | wc -l)

    # Print first 10 lines
    echo "$extra" | head -n 10 | sed 's/^/  /'

    # If more than 10 lines, print "..."
    if [[ "$line_count" -gt 10 ]]; then
      remaining=$((line_count - 10))
      echo "  ... ($remaining more keys)"
    fi

    has_error=1
  fi
done

if [[ "$has_error" -eq 1 ]]; then
  echo ""
  echo "Run 'bazel run //src/static/_locales/tools:remove_extra_keys' to fix this."
  exit 1
fi
