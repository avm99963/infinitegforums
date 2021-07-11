// This method is based on the fact that when building the extension for Firefox
// the browser_specific_settings.gecko entry is included.
export function isFirefox() {
  var manifest = chrome.runtime.getManifest();
  return manifest.browser_specific_settings !== undefined &&
      manifest.browser_specific_settings.gecko !== undefined;
}

// Returns whether the extension is a release version.
export function isReleaseVersion() {
  var manifest = chrome.runtime.getManifest();
  return ('version' in manifest) && manifest.version != '0';
}
