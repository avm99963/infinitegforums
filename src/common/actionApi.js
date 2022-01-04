// #!if browser_target == 'chromium_mv3'
export default chrome.action;
// #!else
export default chrome.browserAction;
// #!endif
