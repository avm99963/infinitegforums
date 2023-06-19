// #!if browser_target == 'chromium_mv3'
export default typeof chrome !== 'undefined' ? chrome.action : undefined;
// #!else
export default typeof chrome !== 'undefined' ? chrome.browserAction : undefined;
// #!endif
