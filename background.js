function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

var defaultOptions = {
  "list": true,
  "thread": true,
  "threadall": false,
  "fixedtoolbar": false,
  "redirect": false,
  "history": false,
  "loaddrafts": false,
  "batchduplicate": false,
  "escalatethreads": false
};

function cleanUpOptions() {
  chrome.storage.sync.get(null, function(options) {
    console.log("[cleanUpOptions] Previous options", options);
    var ok = true;
    for (const [opt, value] of Object.entries(defaultOptions)) {
      if (!(opt in options)) {
        ok = false;
        options[opt] = value;
      }
    }

    console.log("[cleanUpOptions] New options", options);

    if (!ok) {
      chrome.storage.sync.set(options);
    }
  });
}

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install" || details.reason == "update") {
    cleanUpOptions();
  }
});
