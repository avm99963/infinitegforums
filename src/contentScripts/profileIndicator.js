import {injectScript, injectStylesheet} from '../common/contentScriptsUtils';
import {setUpListener} from '../common/csEventListener.js';

setUpListener();

injectScript(
    chrome.runtime.getURL('profileIndicatorInject.bundle.js'));
injectStylesheet(
    chrome.runtime.getURL('css/profileindicator_inject.css'));
