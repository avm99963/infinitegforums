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

function cleanUpOptions(options) {
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

  return options;
}

function save() {
  var options = defaultOptions;

  Object.keys(options).forEach(function (opt) {
    options[opt] = document.querySelector("#"+opt).checked;
  });

  chrome.storage.sync.set(options, function() {
    window.close();
  });
}

function i18n() {
  var messages = ["list", "thread", "enhancements", "fixedtoolbar", "redirect", "experimental_label", "history", "save"];

  messages.forEach(function(msg) {
    console.log(msg);
    document.querySelector("[data-i18n=\""+msg+"\"]").innerHTML = chrome.i18n.getMessage("options_"+msg);
  });
}

window.addEventListener("load", function() {
  i18n();

  chrome.storage.sync.get(null, function(items) {
    items = cleanUpOptions(items);

    Object.keys(defaultOptions).forEach(function(opt) {
      if (items[opt] === true) {
        document.querySelector("#"+opt).checked = true;
      }
    });

    document.querySelector("#save").addEventListener("click", save);
  });
});
