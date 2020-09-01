var intersectionObserver;

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });
};

var intersectionOptions = {
  threshold: 1.0,
};

chrome.storage.sync.get(null, function(items) {
  var redirectLink = document.querySelector('.community-console');
  if (items.redirect && redirectLink !== null) {
    window.location = redirectLink.href;
  } else {
    var button =
        document.querySelector('.thread-all-replies__load-more-button');
    if (items.thread && button !== null) {
      intersectionObserver =
          new IntersectionObserver(intersectionCallback, intersectionOptions);
      intersectionObserver.observe(button);
    }
    var allbutton =
        document.querySelector('.thread-all-replies__load-all-button');
    if (items.threadall && button !== null) {
      intersectionObserver =
          new IntersectionObserver(intersectionCallback, intersectionOptions);
      intersectionObserver.observe(allbutton);
    }
  }
});
