import {injectScript, injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getOptions} from '../../common/optionsUtils.js';

import AutoRefresh from './autoRefresh.js';
import ExtraInfo from './extraInfo.js';
import ThreadPageDesignWarning from './threadPageDesignWarning.js';

const SMEI_NESTED_REPLIES = 15;
const SMEI_RCE_THREAD_INTEROP = 22;

injectScript(chrome.runtime.getURL('xhrInterceptorInject.bundle.js'));
injectScript(chrome.runtime.getURL('extraInfoInject.bundle.js'));

getOptions(null).then(options => {
  /* IMPORTANT NOTE: Remember to change this when changing the "ifs" below!! */
  if (options.loaddrafts || options.interopthreadpage ||
      options.nestedreplies) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (options.loaddrafts) {
      startup[4][13] = true;
    }

    if (options.interopthreadpage) {
      var index = startup[1][6].indexOf(SMEI_RCE_THREAD_INTEROP);

      switch (options.interopthreadpage_mode) {
        case 'previous':
          if (index > -1) startup[1][6].splice(index, 1);
          break;

        case 'next':
          if (index == -1) startup[1][6].push(SMEI_RCE_THREAD_INTEROP);
          break;
      }
    }

    if (options.nestedreplies) {
      if (!startup[1][6].includes(SMEI_NESTED_REPLIES))
        startup[1][6].push(SMEI_NESTED_REPLIES);
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }

  // Initialized here instead of in main.js so the first event is received if it
  // happens when the page loads.
  window.TWPTAutoRefresh = new AutoRefresh();
  window.TWPTExtraInfo = new ExtraInfo();
  window.TWPTThreadPageDesignWarning = new ThreadPageDesignWarning();

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

  if (options.uispacing) {
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/shared.css'));
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/console.css'));
  }
});
