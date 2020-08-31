// When the extension gets updated, set new options to their default value.
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == 'install' || details.reason == 'update') {
    chrome.storage.sync.get(null, function(options) {
      cleanUpOptions(options);
    });
  }
});

chrome.browserAction.onClicked.addListener(function() {
  chrome.runtime.openOptionsPage();
});
