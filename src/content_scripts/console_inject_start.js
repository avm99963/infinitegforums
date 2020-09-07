chrome.storage.sync.get(null, function(items) {
  if (items.loaddrafts) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (items.loaddrafts) {
      startup[4][13] = true;
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
