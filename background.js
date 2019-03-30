function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

var defaultOptions = {
  "list": true,
  "thread": true,
  "fixedtoolbar": false,
  "redirect": false,
  "history": false
};

function cleanUpOptions() {
  chrome.storage.sync.get(null, function(options) {
    var ok = true;
    for (const [opt, value] of Object.entries(defaultOptions)) {
      if (!opt in options) {
        ok = false;
        options[opt] = value;
      }
    }

    if (!ok) {
      chrome.storage.sync.set(options);
    }
  });
}

chrome.runtime.onInstalled.addListener(function(details) {
  if (details == "install" || details == "update") {
    cleanUpOptions();
  }
});
