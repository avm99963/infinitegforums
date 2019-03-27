function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.get(null, function(items) {
    if (details.reason == "install") {
      if (isEmpty(items)) {
        chrome.storage.sync.set({"list": true, "thread": true});
      }
    }
  });
});
