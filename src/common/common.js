const defaultOptions = {
  'list': true,
  'thread': true,
  'threadall': false,
  'fixedtoolbar': false,
  'redirect': false,
  'history': false,
  'loaddrafts': false,
  'batchduplicate': false,
  'escalatethreads': false,
  'movethreads': false,
  'increasecontrast': false,
  'stickysidebarheaders': false,
  'profileindicator': false,
  'profileindicatoralt': false,
  'profileindicatoralt_months': 12,
  'ccdarktheme': false,
  'ccdarktheme_mode': 'switch',
  'ccdarktheme_switch_enabled': true,
  'ccforcehidedrawer': false,
  'ccdragndropfix': false,
  'batchlock': false,
  'smei_sortdirection': false,
  'enhancedannouncementsdot': false,
  'repositionexpandthread': false,
};

const specialOptions = [
  'profileindicatoralt_months',
  'ccdarktheme_mode',
  'ccdarktheme_switch_enabled',
  'ccdragndropfix',
];

const deprecatedOptions = [
  'escalatethreads',
  'movethreads',
  'batchduplicate',
];

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function cleanUpOptions(options) {
  console.log('[cleanUpOptions] Previous options', options);

  if (typeof options !== 'object' || options === null) {
    options = defaultOptions;
  } else {
    var ok = true;
    for (const [opt, value] of Object.entries(defaultOptions)) {
      if (!(opt in options)) {
        ok = false;
        options[opt] = value;
      }
    }
  }

  console.log('[cleanUpOptions] New options', options);

  if (!ok) {
    chrome.storage.sync.set(options);
  }

  return options;
}

// This method is based on the fact that when building the extension for Firefox
// the browser_specific_settings.gecko entry is included.
function isFirefox() {
  var manifest = chrome.runtime.getManifest();
  return manifest.browser_specific_settings !== undefined &&
      manifest.browser_specific_settings.gecko !== undefined;
}
