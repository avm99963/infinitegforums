var mutationObserver, intersectionObserver, options;

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == "childList") {
      mutation.addedNodes.forEach(function (node) {
        if (options.list && (typeof node.classList !== "undefined") && node.classList.contains("view-more-button-container")) {
          intersectionObserver.observe(node.querySelector(".view-more-button"));
        }

        if (options.thread && (typeof node.classList !== "undefined") && node.classList.contains("load-more-bar")) {
          intersectionObserver.observe(node.querySelector(".load-more-button"));
        }     
      });
    }
  });
}

function intersectionCallback(entries, observer) { 
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });
};

var observerOptions = {
  childList: true,
  attributes: true,
  subtree: true
}

var intersectionOptions = {
  root: document.querySelector('.scrollable-content'),
  rootMargin: '0px',
  threshold: 1.0
}

chrome.storage.sync.get(null, function(items) {
  options = items;

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document.querySelector(".scrollable-content"), observerOptions);

  intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);

  if (options.fixedtoolbar) {
    var link = document.createElement('link');
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("href", "data:text/css;charset=UTF-8,ec-bulk-actions{position: sticky; top: 0; background: white; z-index: 99;}");
  }

  document.head.appendChild(link);
});
