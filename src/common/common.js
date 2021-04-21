const optionsPrototype = {
  // Available options:
  'list': {
    defaultValue: true,
    context: 'options',
  },
  'thread': {
    defaultValue: true,
    context: 'options',
  },
  'threadall': {
    defaultValue: false,
    context: 'options',
  },
  'fixedtoolbar': {
    defaultValue: false,
    context: 'options',
  },
  'redirect': {
    defaultValue: false,
    context: 'options',
  },
  'history': {
    defaultValue: false,
    context: 'options',
  },
  'loaddrafts': {
    defaultValue: false,
    context: 'options',
  },
  'increasecontrast': {
    defaultValue: false,
    context: 'options',
  },
  'stickysidebarheaders': {
    defaultValue: false,
    context: 'options',
  },
  'profileindicator': {
    defaultValue: false,
    context: 'options',
  },
  'profileindicatoralt': {
    defaultValue: false,
    context: 'options',
  },
  'profileindicatoralt_months': {
    defaultValue: 12,
    context: 'options',
  },
  'ccdarktheme': {
    defaultValue: false,
    context: 'options',
  },
  'ccdarktheme_mode': {
    defaultValue: 'switch',
    context: 'options',
  },
  'ccforcehidedrawer': {
    defaultValue: false,
    context: 'options',
  },
  'ccdragndropfix': {
    defaultValue: false,
    context: 'options',
  },
  'batchlock': {
    defaultValue: false,
    context: 'options',
  },
  'enhancedannouncementsdot': {
    defaultValue: false,
    context: 'options',
  },
  'repositionexpandthread': {
    defaultValue: false,
    context: 'options',
  },

  // Experiments:
  'threadlistavatars': {
    defaultValue: false,
    context: 'experiments',
  },

  // Internal options:
  'ccdarktheme_switch_enabled': {
    defaultValue: true,
    context: 'internal',
  },

  // Deprecated options:
  'escalatethreads': {
    defaultValue: false,
    context: 'deprecated',
  },
  'movethreads': {
    defaultValue: false,
    context: 'deprecated',
  },
  'batchduplicate': {
    defaultValue: false,
    context: 'deprecated',
  },
  'smei_sortdirection': {
    defaultValue: false,
    context: 'deprecated',
  },
};

const specialOptions = [
  'profileindicatoralt_months',
  'ccdarktheme_mode',
  'ccdarktheme_switch_enabled',
  'ccdragndropfix',
];

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Adds missing options with their default value. If |dryRun| is set to false,
// they are also saved to the sync storage area.
function cleanUpOptions(options, dryRun = false) {
  console.log('[cleanUpOptions] Previous options', JSON.stringify(options));

  if (typeof options !== 'object' || options === null) options = {};

  var ok = true;
  for (const [opt, optMeta] of Object.entries(optionsPrototype)) {
    if (!(opt in options)) {
      ok = false;
      options[opt] = optMeta['defaultValue'];
    }
  }

  console.log('[cleanUpOptions] New options', JSON.stringify(options));

  if (!ok && !dryRun) {
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
