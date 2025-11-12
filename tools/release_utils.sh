# Generates the RAW_GIT_VERSION var from Bazel's stable status file.
function generate_raw_git_version_var() {
  RAW_GIT_VERSION=
  if [ -n "${BAZEL_STABLE_STATUS_FILE-}" ]; then
    RAW_GIT_VERSION=$(sed --sandbox -n '0,/^STABLE_RAW_GIT_VERSION /{s/^STABLE_RAW_GIT_VERSION \(.*\)$/\1/p}' "${BAZEL_STABLE_STATUS_FILE}")
  fi
}

# Generates the VERSION and VERSION_NAME vars according to
# RAW_GIT_VERSION.
function generate_version_vars() {
  if [ -z "${RAW_GIT_VERSION-}" ]; then
    echo >&2 "ERROR: RAW_GIT_VERSION is not set or empty."
    return 1
  fi

  # If the raw git version name contains a hyphen then it isn't a
  # release version (the current commit doesn't contain a release tag).
  # This is also the case if it doesn't start with a "v".
  if [[ $RAW_GIT_VERSION == *"-"* || $RAW_GIT_VERSION != "v"* ]]; then
    if [[ $CHANNEL == "canary" && $RAW_GIT_VERSION == "v"* && \
      $RAW_GIT_VERSION != *"dirty" ]]; then
      # If we're releasing a canary build and the build is not dirty,
      # generate a version number
      local versionExplode
      IFS='-' read -ra versionExplode <<< "${RAW_GIT_VERSION:1}"
      local lastRelease="${versionExplode[0]}"
      local patchesSinceLastRelease=${versionExplode[1]}
      VERSION="${lastRelease}.${patchesSinceLastRelease}"
      VERSION_NAME="${VERSION}-${CHANNEL}"
    else
      # As it isn't a release version, setting version number to 0 so it
      # cannot be uploaded to the Chrome Web Store
      VERSION="0"
      VERSION_NAME="${RAW_GIT_VERSION}-$CHANNEL"
    fi
  else
    # It is a release version, set the version fields accordingly.
    VERSION="${RAW_GIT_VERSION:1}"
    VERSION_NAME="${VERSION}-$CHANNEL"
  fi
}
