# Updates manifest.json field
function set_manifest_field() {
  sed -i -E "s/\"$1\": \"[^\"]*\"/\"$1\": \"$2\"/" $MANIFEST_FILE
}

# Updates all the manifest.json fields not related to versioning
# TODO(https://iavm.xyz/b/twpowertools/256): move this to
# stamp_manifest.sh.
function set_other_manifest_fields() {
  if [[ $CHANNEL == "canary" ]]; then
    # Change manifest.json to label the release as canary
    set_manifest_field "name" "__MSG_appNameCanary__" $MANIFEST_FILE

    if [[ $BROWSER == "gecko" ]]; then
      # Change the extension ID
      set_manifest_field "id" "twpowertools+canary@avm99963.com" $MANIFEST_FILE
    fi
  elif [[ $CHANNEL == "beta" ]]; then
    # Change manifest.json to label the release as beta
    set_manifest_field "name" "__MSG_appNameBeta__" $MANIFEST_FILE

    if [[ $BROWSER == "gecko" ]]; then
      # Change the extension ID
      set_manifest_field "id" "twpowertools+beta@avm99963.com" $MANIFEST_FILE
    fi
  else
    if [[ $BROWSER == "gecko" ]]; then
      set_manifest_field "name" "__MSG_appNameGecko__" $MANIFEST_FILE
    fi
  fi
}
