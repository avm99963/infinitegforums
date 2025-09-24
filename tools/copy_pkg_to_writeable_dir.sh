#!/usr/bin/env bash
# This script copies the built extension to a writable directory, so that all
# browsers can load it.
# We do this because Chrome needs to write a _metadata folder into the unpacked
# extension's directory when installing it.
set -e

DEST_DIR="dist/"

rm -rf "$DEST_DIR"
mkdir -p "$DEST_DIR"

cp -rL --no-preserve=mode,ownership bazel-bin/unpacked_pkg/. "$DEST_DIR/"

NO_FORMAT="\033[0m"
C_MAGENTA2="\033[38;5;200m"
echo -e "${C_MAGENTA2}✅ [ $(date +%T) ]:${NO_FORMAT} The extension is now available in '$DEST_DIR'. You can load it as an unpacked extension."
