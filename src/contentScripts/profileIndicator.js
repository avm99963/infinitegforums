import {injectScript, injectStylesheet} from '../common/contentScriptsUtils.js';
import {setUpListener} from '../common/csEventListener.js';

setUpListener();

chrome.storage.sync.get(null, function(options) {
  if (options.profileindicator || options.profileindicatoralt) {
    injectScript(
        chrome.runtime.getURL('profileIndicatorInject.bundle.js'));
    injectStylesheet(
        chrome.runtime.getURL('css/profileindicator_inject.css'));
  }
});
