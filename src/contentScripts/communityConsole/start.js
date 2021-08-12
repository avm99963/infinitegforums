import {injectScript, injectStylesheet} from '../../common/contentScriptsUtils.js';

import AutoRefresh from './autoRefresh.js';

const SMEI_UNIFIED_PROFILES = 9;

chrome.storage.sync.get(null, function(items) {
  /* IMPORTANT NOTE: Remember to change this when changing the "ifs" below!! */
  if (items.loaddrafts || items.disableunifiedprofiles) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (items.loaddrafts) {
      startup[4][13] = true;
    }

    if (items.disableunifiedprofiles) {
      var index = startup[1][6].indexOf(SMEI_UNIFIED_PROFILES);
      if (index > -1) startup[1][6].splice(index, 1);
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }

  // Initialized here instead of in main.js so the first |ViewForumResponse|
  // event is received if it happens when the page loads.
  if (items.autorefreshlist)
    window.TWPTAutoRefresh = new AutoRefresh();

  if (items.ccdarktheme) {
    switch (items.ccdarktheme_mode) {
      case 'switch':
        if (items.ccdarktheme_switch_status == true)
          injectStylesheet(chrome.runtime.getURL('css/ccdarktheme.css'));
        break;

      case 'system':
        injectStylesheet(chrome.runtime.getURL('css/ccdarktheme.css'), {
          'media': '(prefers-color-scheme: dark)',
        });
        break;
    }
  }

  injectScript(chrome.runtime.getURL('xhrInterceptorInject.bundle.js'));
});
