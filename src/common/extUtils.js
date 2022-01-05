// Returns whether the extension is a release version.
export function isReleaseVersion() {
  var manifest = chrome.runtime.getManifest();
  return ('version' in manifest) && manifest.version != '0';
}

// Returns the extension version
export function getExtVersion() {
  var manifest = chrome.runtime.getManifest();
  return manifest?.version;
}
