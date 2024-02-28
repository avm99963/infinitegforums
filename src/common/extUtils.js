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

// Returns a semver-compatible extension version
export function getSemVerExtVersion() {
  const version = getExtVersion();
  if (!(typeof version === 'string')) return null;
  return version.match(/^[^.]*(?:\.[^.]*){0,2}/)?.[0] ?? null;
}

// Get a URL to a document which is part of the extension documentation (using
// |ref| as the Git ref).
export function getDocURLWithRef(doc, ref) {
  return 'https://gerrit.avm99963.com/plugins/gitiles/infinitegforums/+/' +
      ref + '/docs/' + doc;
}

// Get a URL to a document which is part of the extension documentation
// (autodetect the appropriate Git ref)
export function getDocURL(doc) {
  if (!isProdVersion()) return getDocURLWithRef(doc, 'HEAD');

  var version = getExtVersion();
  return getDocURLWithRef(doc, 'refs/tags/v' + version);
}
