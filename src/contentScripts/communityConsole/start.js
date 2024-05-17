import {injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getOptions} from '../../common/optionsUtils.js';

import FlattenThreadsReplyActionHandler from './flattenThreads/replyActionHandler.js';
import WorkflowsImport from './workflows/import.js';

getOptions(null).then(options => {
  /* IMPORTANT NOTE: Remember to change this when changing the "ifs" below!! */
  if (options.fixpekb269560789) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (options.fixpekb269560789) {
      if (startup[1]?.[1]?.[8]?.[7]) {
        delete startup[1]?.[1]?.[8]?.[7];
      }
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }

  // Initialized here instead of in main.js so the first event is received if it
  // happens when the page loads.
  window.TWPTWorkflowsImport = new WorkflowsImport();

  if (options.ccdarktheme) {
    switch (options.ccdarktheme_mode) {
      case 'switch':
        if (options.ccdarktheme_switch_status == true)
          injectStylesheet(chrome.runtime.getURL('ccDarkTheme.bundle.css'));
        break;

      case 'system':
        injectStylesheet(chrome.runtime.getURL('ccDarkTheme.bundle.css'), {
          'media': '(prefers-color-scheme: dark)',
        });
        break;
    }
  }

  if (options.uispacing) {
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/shared.css'));
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/console.css'));
  }

  const flattenThreadsReplyActionHandler =
      new FlattenThreadsReplyActionHandler(options);
  flattenThreadsReplyActionHandler.handleIfApplicable();
});
