chrome.storage.sync.get(null, function(items) {
  if (items.loaddrafts || items.escalatethreads || items.movethreads) {
    var startup = JSON.parse(document.querySelector("html").getAttribute("data-startup"));

    if (items.loaddrafts) {
      startup[4][13] = true;
    }

    if (items.escalatethreads) {
      startup[4][20] = true;
    }

    if (items.movethreads) {
      startup[4][18] = true;
    }

    document.querySelector("html").setAttribute("data-startup", JSON.stringify(startup));
  }
});
