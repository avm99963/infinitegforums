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

var intersectionObserver = new IntersectionObserver(intersectionCallback, intersectionOptions);
intersectionObserver.observe(document.querySelector(".thread-list-threads__load-more-button"));
