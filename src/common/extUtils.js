// Returns whether the extension is a production version (released stable or
// beta version).
export function isProdVersion() {
  // #!if production && !canary
  return true;
  // #!else
  return false;
  // #!endif
}

// Returns the extension version
export function getExtVersion() {
  var manifest = chrome.runtime.getManifest();
  return manifest?.version;
}
