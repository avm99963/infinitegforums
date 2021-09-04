import {injectScript, injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getOptions} from '../../common/optionsUtils.js';

import AutoRefresh from './autoRefresh.js';

const SMEI_UNIFIED_PROFILES = 9;

getOptions(null).then(options => {
  /* IMPORTANT NOTE: Remember to change this when changing the "ifs" below!! */
  if (options.loaddrafts || options.disableunifiedprofiles) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (options.loaddrafts) {
      startup[4][13] = true;
    }

    if (options.disableunifiedprofiles) {
      var index = startup[1][6].indexOf(SMEI_UNIFIED_PROFILES);
      if (index > -1) startup[1][6].splice(index, 1);
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }

  // Initialized here instead of in main.js so the first |ViewForumResponse|
  // event is received if it happens when the page loads.
  window.TWPTAutoRefresh = new AutoRefresh();

  if (options.ccdarktheme) {
    switch (options.ccdarktheme_mode) {
      case 'switch':
        if (options.ccdarktheme_switch_status == true)
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
