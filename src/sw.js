// IMPORTANT: keep this file in sync with background.js
import {cleanUpOptions} from './common/optionsUtils.js'

// When the extension gets updated, set new options to their default value.
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install' || details.reason == 'update') {
    chrome.storage.sync.get(null, options => {
      cleanUpOptions(options, false);
    });
  }
});

chrome.action.onClicked.addListener(_ => {
  chrome.runtime.openOptionsPage();
});
