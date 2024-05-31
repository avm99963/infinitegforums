import {injectStylesheet} from '../../common/contentScriptsUtils';
import {getOptions} from '../../common/options/optionsUtils.js';

import FlattenThreadsReplyActionHandler from './flattenThreads/replyActionHandler.js';
import ThreadPageDesignWarning from './threadPageDesignWarning.js';

getOptions(null).then(options => {
  // Initialized here instead of in main.js so the first event is received if it
  // happens when the page loads.
  window.TWPTThreadPageDesignWarning = new ThreadPageDesignWarning();

  if (options.uispacing) {
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/shared.css'));
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/console.css'));
  }

  const flattenThreadsReplyActionHandler =
      new FlattenThreadsReplyActionHandler(options);
  flattenThreadsReplyActionHandler.handleIfApplicable();
});
