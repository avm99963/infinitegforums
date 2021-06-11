const SMEI_SORT_DIRECTION = 8;
const SMEI_UNIFIED_PROFILES = 9;

chrome.storage.sync.get(null, function(items) {
  /* IMPORTANT NOTE: Remember to change this when changing the "ifs" below!! */
  if (items.loaddrafts || items.smei_sortdirection ||
      items.disableunifiedprofiles) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (items.loaddrafts) {
      startup[4][13] = true;
    }

    if (items.smei_sortdirection) {
      if (!startup[1][6].includes(SMEI_SORT_DIRECTION))
        startup[1][6].push(SMEI_SORT_DIRECTION);
    }

    if (items.disableunifiedprofiles) {
      var index = startup[1][6].indexOf(SMEI_UNIFIED_PROFILES);
      if (index > -1) startup[1][6].splice(index, 1);
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }

  if (items.ccdarktheme) {
    switch (items.ccdarktheme_mode) {
      case 'switch':
        if (items.ccdarktheme_switch_status == true)
          injectStylesheet(chrome.runtime.getURL('injections/ccdarktheme.css'));
        break;

      case 'system':
        injectStylesheet(chrome.runtime.getURL('injections/ccdarktheme.css'), {
          'media': '(prefers-color-scheme: dark)',
        });
        break;
    }
  }
});
