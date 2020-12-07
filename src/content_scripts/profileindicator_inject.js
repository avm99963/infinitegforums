chrome.storage.sync.get(null, function(options) {
  if (options.profileindicator || options.profileindicatoralt) {
    injectScript(
        chrome.runtime.getURL('injections/profileindicator_inject.js'));
    injectStylesheet(
        chrome.runtime.getURL('injections/profileindicator_inject.css'));
  }
});
