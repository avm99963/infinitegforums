function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function save() {
  chrome.storage.sync.set({
    "list": document.querySelector("#list").checked,
    "thread": document.querySelector("#thread").checked
  }, function() {
    window.close();
  });
}

window.addEventListener("load", function() {
  chrome.storage.sync.get(null, function(items) {
    if (isEmpty(items)) {
      items = {"list": true, "thread": true};
      chrome.storage.sync.set(items);
    }

    if (items.list === true) {
      document.querySelector("#list").checked = true;
    }

    if (items.thread === true) {
      document.querySelector("#thread").checked = true;
    }

    document.querySelector("#save").addEventListener("click", save);
  });
});
