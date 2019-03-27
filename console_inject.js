function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == "childList") {
      mutation.addedNodes.forEach(function (node) {
        if ((typeof node.classList !== "undefined") && node.classList.contains("view-more-button-container")) {
          intersectionObserver.observe(node.querySelector(".view-more-button"));
        }

        if ((typeof node.classList !== "undefined") && node.classList.contains("load-more-bar")) {
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

var mutationObserver = new MutationObserver(mutationCallback);
mutationObserver.observe(document.querySelector(".scrollable-content"), observerOptions);

var intersectionOptions = {
  root: document.querySelector('.scrollable-content'),
  rootMargin: '0px',
  threshold: 1.0
}

var intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);
