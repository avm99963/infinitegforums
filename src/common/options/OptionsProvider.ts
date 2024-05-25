import { Mutex, MutexInterface, withTimeout } from 'async-mutex';

import { getOptions } from './optionsUtils';
import { OptionCodename, OptionValues } from './optionsPrototype';

export default class OptionsProvider {
  private optionValues: OptionValues;
  private isStale = true;
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);

  constructor() {
    // If the extension settings change, set the current cached value as stale.
    // We could try only doing this only when we're sure it has changed, but
    // there are many factors (if the user has changed it manually, if a kill
    // switch was activated, etc.) so we'll do it every time.
    chrome.storage.onChanged.addListener((_, areaName) => {
      if (areaName !== 'sync') return;
      console.debug('[optionsWatcher] Marking options as stale.');
      this.isStale = true;
    });
  }

  // Returns a promise resolving to the value of option |option|.
  getOption<O extends OptionCodename>(option: O): Promise<OptionValues[O]> {
    // When the cached value is marked as stale, it might be possible that there
    // is a flood of calls to isEnabled(), which in turn causes a flood of calls
    // to getOptions() because it takes some time for it to be marked as not
    // stale. Thus, hiding the logic behind a mutex fixes this.
    return this.mutex.runExclusive(async () => {
      if (!this.isStale) return Promise.resolve(this.optionValues[option]);

      this.optionValues = await getOptions();
      this.isStale = false;
      return this.optionValues[option];
    });
  }

  // Returns a promise resolving to whether the |feature| is enabled.
  async isEnabled(option: OptionCodename) {
    const value = await this.getOption(option);
    return value === true;
  }
}
