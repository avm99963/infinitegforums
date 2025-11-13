let actionApi;

// #!if defined(MV3)
actionApi = typeof chrome !== 'undefined' ? chrome.action : undefined;
// #!else
actionApi = typeof chrome !== 'undefined' ? chrome.browserAction : undefined;
// #!endif

export default actionApi;
