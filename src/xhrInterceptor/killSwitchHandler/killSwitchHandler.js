import InternalKillSwitchWatcher from '../../killSwitch/internalKillSwitchWatcher.js';

export const KILL_SWITCH = 'killswitch_xhrproxy';
export const KILL_SWITCH_LOCALSTORAGE_KEY = 'TWPTKillSwitchXHRProxyEnabled';
export const KILL_SWITCH_LOCALSTORAGE_VALUE = 'true';

export default class XHRProxyKillSwitchHandler {
  constructor() {
    this.watcher =
        new InternalKillSwitchWatcher(KILL_SWITCH, this.onChange, true);
  }

  onChange(isActive) {
    if (isActive) {
      window.localStorage.setItem(
          KILL_SWITCH_LOCALSTORAGE_KEY, KILL_SWITCH_LOCALSTORAGE_VALUE);
    } else {
      window.localStorage.removeItem(KILL_SWITCH_LOCALSTORAGE_KEY);
    }
  }
}
