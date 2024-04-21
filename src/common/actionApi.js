let actionApi;

// #!if browser_target == 'chromium_mv3'
actionApi = typeof chrome !== 'undefined' ? chrome.action : undefined;
// #!else
actionApi = typeof chrome !== 'undefined' ? chrome.browserAction : undefined;
// #!endif

export default actionApi;
