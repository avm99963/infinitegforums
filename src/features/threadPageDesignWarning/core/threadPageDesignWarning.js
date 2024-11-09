import {MDCTooltip} from '@material/tooltip';
import {waitFor} from 'poll-until-promise';

import {parseUrl} from '../../../common/commonUtils.js';
import {injectStylesheet} from '../../../common/contentScriptsUtils';
import {getDocURL} from '../../../common/extUtils.js';
import {getOptions} from '../../../common/options/optionsUtils.js';

import {createExtBadge} from '../../../contentScripts/communityConsole/utils/common.js';

const kSMEINestedReplies = 15;
const kViewThreadResponse = 'TWPT_ViewThreadResponse';

export default class ThreadPageDesignWarning {
  constructor() {
    this.isSetUp = false;
  }

  setUp() {
    if (this.isSetUp) return;

    this.isSetUp = true;
    this.lastThread = {
      body: {},
      id: -1,
      timestamp: 0,
    };
    this.setUpHandler();

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
      } else {
        this.removeHandler();
      }
    });

    this.isExperimentEnabled = this.isNestedRepliesExperimentEnabled();
  }

  isNestedRepliesExperimentEnabled() {
    if (!document.documentElement.hasAttribute('data-startup')) return false;

    let startup =
        JSON.parse(document.documentElement.getAttribute('data-startup'));
    return startup?.[1]?.[6]?.includes?.(kSMEINestedReplies);
  }

  eventHandler(e) {
    if (e.detail.id < this.lastThread.id) return;

    this.lastThread = {
      body: e.detail.body,
      id: e.detail.id,
      timestamp: Date.now(),
    };
  }

  setUpHandler() {
    window.addEventListener(kViewThreadResponse, this.eventHandler.bind(this));
  }

  removeHandler() {
    window.removeEventListener(
        kViewThreadResponse, this.eventHandler.bind(this));
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
                 if (!this.setUp) {
                   return Promise.reject(new Error(
                       'ThreadPageDesignWarning hasn\'t been set up yet.'));
                 }

                 if (this.shouldShowWarning === undefined) {
                   return Promise.reject(
                       new Error('shouldShowWarning is not defined.'));
                 }

                 return Promise.resolve({result: this.shouldShowWarning});
               },
               {
                 interval: 500,
                 timeout: 10 * 1000,
               })
        .then(preShouldShowWarning => {
          if (!preShouldShowWarning.result) return;

          // If the global SMEI experiment is enabled, all threads use nested
          // replies, so we'll skip the per-thread check and always show the
          // warning banner.
          if (this.isExperimentEnabled) return Promise.resolve({result: true});

          let currentThread = parseUrl(location.href);
          if (currentThread === false)
            throw new Error('current thread id cannot be parsed.');

          return waitFor(() => {
            let now = Date.now();
            let lastThreadInfo = this.lastThread.body['1']?.['2']?.['1'];
            if (now - this.lastThread.timestamp > 30 * 1000 ||
                lastThreadInfo?.['1'] != currentThread.thread ||
                lastThreadInfo?.['3'] != currentThread.forum)
              throw new Error(
                  'cannot obtain information about current thread.');

            // If the messageOrGap field contains any items, the thread is using
            // nested replies. Otherwise, it probably isn't using them.
            return Promise.resolve(
                {result: this.lastThread.body['1']?.['40']?.length > 0});
          }, {
            interval: 500,
            timeout: 10 * 1000,
          });
        })
        .then(shouldShowWarning => {
          if (shouldShowWarning.result) this.injectWarning(content);
        })
        .catch(err => {
          console.error(
              '[threadPageDesignWarning] An error ocurred while trying to decide whether to show warning: ',
              err);
        });
  }
}
