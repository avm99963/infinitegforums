import {KILL_SWITCH_LOCALSTORAGE_KEY, KILL_SWITCH_LOCALSTORAGE_VALUE} from '../xhrInterceptor/killSwitchHandler.js';
import XHRProxy from '../xhrInterceptor/XHRProxy.js';

if (window.localStorage.getItem(KILL_SWITCH_LOCALSTORAGE_KEY) !==
    KILL_SWITCH_LOCALSTORAGE_VALUE) {
  new XHRProxy();
}
