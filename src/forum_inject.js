var intersectionObserver;

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });
};

var intersectionOptions = {
  threshold: 1.0
}

chrome.storage.sync.get(null, function(items) {
  var button = document.querySelector(".thread-list-threads__load-more-button");
  if (items.list && button !== null) {
    intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);
    intersectionObserver.observe(button);
  }
});
