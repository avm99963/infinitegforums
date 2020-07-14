var mutationObserver, intersectionObserver, options;

function parseUrl(url) {
  var forum_a = url.match(/forum\/([0-9]+)/i);
  var thread_a = url.match(/thread\/([0-9]+)/i);

  if (forum_a === null || thread_a === null) {
    return false;
  }

  return {
    "forum": forum_a[1],
    "thread": thread_a[1]
  };
}

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == "childList") {
      mutation.addedNodes.forEach(function (node) {
        if (typeof node.classList !== "undefined") {
          if (options.thread && node.classList.contains("load-more-bar")) {
            intersectionObserver.observe(node.querySelector(".load-more-button"));
          }

          if (options.threadall && node.classList.contains("load-more-bar")) {
            intersectionObserver.observe(node.querySelector(".load-all-button"));
          }

          if (options.history && ("parentNode" in node) && node.parentNode !== null && ("tagName" in node.parentNode) && node.parentNode.tagName == "EC-USER") {
            var nameElement = node.querySelector(".name span");
            if (nameElement !== null) {
              var name = nameElement.innerHTML;
              var query = encodeURIComponent("(creator:\""+name+"\" | replier:\""+name+"\") -forum:0");
              var urlpart = encodeURIComponent("query="+query);
              var link = document.createElement("a");
              link.setAttribute("href", "https://support.google.com/s/community/search/"+urlpart);
              link.innerText = chrome.i18n.getMessage("inject_previousposts");
              node.querySelector(".main-card-content").appendChild(document.createElement("br"));
              node.querySelector(".main-card-content").appendChild(link);
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

function injectStyles(css) {
  var link = document.createElement('link');
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", "data:text/css;charset=UTF-8,"+encodeURIComponent(css));
  document.head.appendChild(link);
}

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
    injectStyles("ec-bulk-actions{position: sticky; top: 0; background: white; z-index: 96;}");
  }

  if (options.increasecontrast) {
    injectStyles(".thread-summary.read{background: #ecedee!important;}");
  }
});
