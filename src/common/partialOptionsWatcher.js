import {Mutex, withTimeout} from 'async-mutex';

import {getOptions} from './optionsUtils.js';

/**
 * @deprecated Use {@link OptionsProvider} instead.
 */
export default class PartialOptionsWatcher {
  constructor(options) {
    this.watchedOptions = options;
    this.options = [];
    for (let o of options) this.options[o] = false;
    this.isStale = true;
    this.mutex = withTimeout(new Mutex(), 60 * 1000);

    // If the extension settings change, set the current cached value as stale.
    // We could try only doing this only when we're sure it has changed, but
    // there are many factors (if the user has changed it manually, if a kill
    // switch was activated, etc.) so we'll do it every time.
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'sync') return;
      console.debug('[optionsWatcher] Marking options as stale.');
      this.isStale = true;
    });
  }

  // Returns a promise resolving to the value of option |option|.
  getOption(option) {
    if (!this.watchedOptions.includes(option))
      return Promise.reject(new Error(
          '[optionsWatcher] We\'re not watching option ' + option + '.'));

    // When the cached value is marked as stale, it might be possible that there
    // is a flood of calls to isEnabled(), which in turn causes a flood of calls
    // to getOptions() because it takes some time for it to be marked as not
    // stale. Thus, hiding the logic behind a mutex fixes this.
    return this.mutex.runExclusive(() => {
      if (!this.isStale) return Promise.resolve(this.options[option]);

      return getOptions(this.watchedOptions).then(options => {
        this.options = options;
        this.isStale = false;
        return this.options[option];
      });
    });
  }

  // Returns a promise resolving to whether the |feature| is enabled.
  isEnabled(feature) {
    return this.getOption(feature).then(option => option === true);
  }
}
