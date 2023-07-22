import {getForceDisabledFeatures} from '../common/optionsUtils.js';

/**
 * Watches for changes to an internal kill switch and calls a callback when a
 * change is detected.
 */
export default class InternalKillSwitchWatcher {
  /**
   * @param {string} killSwitch - The internal kill switch codename.
   * @param {changeCallback} callback - The callback which is called when a
   *     change is detected.
   * @param {boolean} callbackOnFirstLoad - Whether the callback should be
   *     called after first loading which is the current state of the kill
   *     switch.
   */
  constructor(killSwitch, callback, callbackOnFirstLoad = true) {
    this.watchedKillSwitch = killSwitch;
    this.isActive = null;
    this.callback = callback;
    this.#setChangeListener();
    this.#firstLoadGetValue(callbackOnFirstLoad);
  }

  #setChangeListener() {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      const change = changes?.['_forceDisabledFeatures'];
      if (areaName !== 'sync' || change === undefined) return;
      const newValue = change.newValue.includes(this.watchedKillSwitch);
      const hasChanged = newValue !== this.isActive;
      this.isActive = newValue;
      if (hasChanged) this.callback(this.isActive);
    });
  }

  async #firstLoadGetValue(callbackOnFirstLoad) {
    const activeKillSwitches = await getForceDisabledFeatures();
    this.isActive = activeKillSwitches.includes(this.watchedKillSwitch);
    if (callbackOnFirstLoad) this.callback(this.isActive);
  }
}

/**
 * Callback which receives changes to the kill switch active state.
 * @callback changeCallback
 * @param {boolean} Whether the kill switch is currently active.
 */
