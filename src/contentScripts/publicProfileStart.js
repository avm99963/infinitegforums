import {injectScript} from '../common/contentScriptsUtils';
import {getOptions} from '../common/options/optionsUtils.js';

getOptions('perforumstats').then(options => {
  if (options?.perforumstats)
    injectScript(chrome.runtime.getURL('extraInfoInject.bundle.js'));
});
