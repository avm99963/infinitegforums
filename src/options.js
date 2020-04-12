function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

const defaultOptions = {
  "list": true,
  "thread": true,
  "threadall": false,
  "fixedtoolbar": false,
  "redirect": false,
  "history": false,
  "loaddrafts": false,
  "batchduplicate": false,
  "escalatethreads": false,
  "movethreads": false
};

const deprecatedOptions = [
  "list",
  "escalatethreads",
  "movethreads"
];

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
    if (deprecatedOptions.includes(opt)) return;
    options[opt] = document.querySelector("#"+opt).checked || false;
  });

  chrome.storage.sync.set(options, function() {
    window.close();
  });
}

function i18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => el.innerHTML = chrome.i18n.getMessage("options_"+el.getAttribute("data-i18n")));
}

function thread() {
  if (document.querySelector("#thread").checked && document.querySelector("#threadall").checked) {
    document.querySelector("#"+(this.id == "thread" ? "threadall" : "thread")).checked = false;
  }
}

window.addEventListener("load", function() {
  i18n();

  chrome.storage.sync.get(null, function(items) {
    items = cleanUpOptions(items);

    Object.keys(defaultOptions).forEach(function(opt) {
      if (items[opt] === true && !deprecatedOptions.includes(opt)) {
        document.querySelector("#"+opt).checked = true;
      }
    });

    ["thread", "threadall"].forEach(el => document.querySelector("#"+el).addEventListener("change", thread));
    document.querySelector("#save").addEventListener("click", save);
  });
});
