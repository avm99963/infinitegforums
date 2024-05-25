import {injectStylesheet} from '../common/contentScriptsUtils.js';
import {getOptions} from '../common/options/optionsUtils.js';
import {setUpRedirectIfEnabled} from '../redirect/setup.js';

getOptions(['uispacing', 'redirect']).then(options => {
  if (options.uispacing) {
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/shared.css'));
    injectStylesheet(chrome.runtime.getURL('css/ui_spacing/twbasic.css'));
  }

  setUpRedirectIfEnabled(options);
});
