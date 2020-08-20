chrome.storage.sync.get(null, function(items) {
  if (items.loaddrafts) {
    var startup =
        JSON.parse(document.querySelector('html').getAttribute('data-startup'));

    if (items.loaddrafts) {
      startup[4][13] = true;
    }

    document.querySelector('html').setAttribute(
        'data-startup', JSON.stringify(startup));
  }
});
