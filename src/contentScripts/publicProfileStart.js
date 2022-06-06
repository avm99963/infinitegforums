import {injectScript} from '../common/contentScriptsUtils.js';
import {getOptions} from '../common/optionsUtils.js';

getOptions('perforumstats').then(options => {
  if (options?.perforumstats)
    injectScript(chrome.runtime.getURL('extraInfoInject.bundle.js'));
});
