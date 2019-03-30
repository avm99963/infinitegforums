var mutationObserver, intersectionObserver, options;

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == "childList") {
      mutation.addedNodes.forEach(function (node) {
        if (typeof node.classList !== "undefined") {
          if (options.list && node.classList.contains("view-more-button-container")) {
            intersectionObserver.observe(node.querySelector(".view-more-button"));
          }

          if (options.thread && node.classList.contains("load-more-bar")) {
            intersectionObserver.observe(node.querySelector(".load-more-button"));
          }

          if (options.history && ("parentNode" in node) && node.parentNode !== null && ("tagName" in node.parentNode) && node.parentNode.tagName == "EC-USER") {
            var nameElement = node.querySelector(".name span");
            if (nameElement !== null) {
              var name = encodeURIComponent(nameElement.innerText);
              var link = document.createElement("a");
              link.setAttribute("href", "https://support.google.com/s/community/search/query%3D%2528creator%253A%2522"+name+"%2522%2B%257C%2Breplier%253A%2522"+name+"%2522%2529%2B-forum%253A0");
              link.innerText = chrome.i18n.getMessage("inject_previousposts");
              node.querySelector(".main-card").appendChild(document.createElement("br"));
              node.querySelector(".main-card").appendChild(link);
            }
          }
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
    document.head.appendChild(link);
  }
});
