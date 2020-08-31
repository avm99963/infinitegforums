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
};

const specialOptions = [
  'profileindicatoralt_months',
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
