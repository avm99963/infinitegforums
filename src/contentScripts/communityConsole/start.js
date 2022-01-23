import {injectScript, injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getOptions} from '../../common/optionsUtils.js';

import AutoRefresh from './autoRefresh.js';
import ExtraInfo from './extraInfo.js';

getOptions(null).then(options => {
  /* IMPORTANT NOTE: Remember to change this when changing the "ifs" below!! */
  if (options.loaddrafts) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (options.loaddrafts) {
      startup[4][13] = true;
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }

  // Initialized here instead of in main.js so the first event is received if it
  // happens when the page loads.
  window.TWPTAutoRefresh = new AutoRefresh();
  window.TWPTExtraInfo = new ExtraInfo();

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
