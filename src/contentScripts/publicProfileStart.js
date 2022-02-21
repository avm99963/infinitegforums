import {injectScript} from '../common/contentScriptsUtils.js';
import {getOptions} from '../common/optionsUtils.js';

getOptions('extrainfo').then(options => {
  if (options?.extrainfo)
    injectScript(chrome.runtime.getURL('extraInfoInject.bundle.js'));
});
