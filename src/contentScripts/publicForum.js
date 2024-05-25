import {getOptions} from '../common/options/optionsUtils.js';

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

    // On a best-effort basis, move the "ask community" card before the "load
    // more" button, if both exist.
    let buttonContainer = document.querySelector(
        '.thread-list__threads > .thread-list-threads__load-more-container');
    let askCard =
        document.querySelector('.thread-list__threads > .ask-community-card');
    if (buttonContainer !== null && askCard !== null) {
      let threadList = document.querySelector('.thread-list__threads');
      threadList.insertBefore(askCard, buttonContainer);
    }
  }
});
