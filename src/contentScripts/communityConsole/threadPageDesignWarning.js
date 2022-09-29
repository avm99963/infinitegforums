import {MDCTooltip} from '@material/tooltip';
import {waitFor} from 'poll-until-promise';

import {parseUrl} from '../../common/commonUtils.js';
import {injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getDocURL} from '../../common/extUtils.js';
import {getOptions} from '../../common/optionsUtils.js';

import {createExtBadge} from './utils/common.js';

// Forums where Nested Replies have been enabled
const NRS_ENABLED_FORUM_IDS = [51488989];

export default class ThreadPageDesignWarning {
  constructor() {
    // We have to save whether the old UI was enabled at startup, since that's
    // the moment when it takes effect. If the option changes while the tab is
    // open, it won't take effect.
    getOptions([
      'interopthreadpage', 'interopthreadpage_mode'
    ]).then(options => {
      this.shouldShowWarning = options.interopthreadpage &&
          options.interopthreadpage_mode == 'previous';

      if (this.shouldShowWarning) {
        injectStylesheet(
            chrome.runtime.getURL('css/thread_page_design_warning.css'));
      }
    });
  }

  injectWarning(content) {
    let div = document.createElement('div');
    div.classList.add('TWPT-warning');

    let icon = document.createElement('material-icon');
    icon.classList.add('TWPT-warning--icon');

    let iconContent = document.createElement('i');
    iconContent.classList.add('material-icon-i', 'material-icons-extended');
    iconContent.setAttribute('role', 'img');
    iconContent.setAttribute('aria-hidden', 'true');
    iconContent.textContent = 'warning';

    icon.append(iconContent);

    let text = document.createElement('div');
    text.classList.add('TWPT-warning--text');
    text.textContent =
        chrome.i18n.getMessage('inject_threadpagedesign_warning');

    let btn = document.createElement('a');
    btn.classList.add('TWPT-warning--btn');
    btn.href =
        getDocURL('features.md#Thread-page-design-in-the-Community-Console');
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');

    const [badge, badgeTooltip] = createExtBadge();

    let btnText = document.createElement('div');
    btnText.textContent = chrome.i18n.getMessage('btn_learnmore');

    btn.append(badge, btnText);

    div.append(icon, text, btn);
    content.prepend(div);

    new MDCTooltip(badgeTooltip);
  }

  injectWarningIfApplicable(content) {
    return waitFor(
               () => {
                 if (this.shouldShowWarning === undefined)
                   return Promise.reject(
                       new Error('shouldShowWarning is not defined.'));

                 return Promise.resolve(this.shouldShowWarning);
               },
               {
                 interval: 500,
                 timeout: 10 * 1000,
               })
        .then(shouldShowWarning => {
          if (!shouldShowWarning) return;

          let thread = parseUrl(location.href);
          if (thread === false)
            throw new Error('current thread cannot be parsed.');

          if (NRS_ENABLED_FORUM_IDS.includes(parseInt(thread.forum)))
            this.injectWarning(content);
        })
        .catch(err => {
          console.error(
              '[threadPageDesignWarning] An error ocurred while trying to decide whether to show warning: ',
              err);
        });
  }
}
