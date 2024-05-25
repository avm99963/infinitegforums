import {injectStylesheet} from '../../common/contentScriptsUtils';
import {getOptions} from '../../common/options/optionsUtils.js';

import FlattenThreadsReplyActionHandler from './flattenThreads/replyActionHandler.js';

getOptions(null).then(options => {
  if (options.uispacing) {
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/shared.css'));
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/console.css'));
  }

  const flattenThreadsReplyActionHandler =
      new FlattenThreadsReplyActionHandler(options);
  flattenThreadsReplyActionHandler.handleIfApplicable();
});
