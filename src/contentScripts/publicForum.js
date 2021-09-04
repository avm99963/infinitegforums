import {getOptions} from '../common/optionsUtils.js';

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

getOptions('list').then(options => {
  var button = document.querySelector('.thread-list-threads__load-more-button');
  if (options.list && button !== null) {
    intersectionObserver =
        new IntersectionObserver(intersectionCallback, intersectionOptions);
    intersectionObserver.observe(button);
  }
});
