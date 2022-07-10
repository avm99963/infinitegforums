import {injectStylesheet} from '../common/contentScriptsUtils.js';
import {isOptionEnabled} from '../common/optionsUtils.js';

isOptionEnabled('uispacing').then(isUiSpacingEnabled => {
  if (!isUiSpacingEnabled) return;

  injectStylesheet(chrome.runtime.getURL('css/ui_spacing/shared.css'));
  injectStylesheet(chrome.runtime.getURL('css/ui_spacing/twbasic.css'));
});
