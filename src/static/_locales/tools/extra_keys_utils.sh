#!/bin/bash

# Calculate keys present in target but not in source.
# Usage: get_extra_keys "path/to/jq" "source.json" "target.json"
get_extra_keys() {
  local jq="$1"
  local source="$2"
  local target="$3"

  "$jq" --raw-output --null-input \
    --slurpfile source "$source" \
    --slurpfile target "$target" \
    '($target[0] | keys) - ($source[0] | keys) | .[]'
}
