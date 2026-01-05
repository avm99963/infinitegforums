import {injectStylesheet} from '../common/contentScriptsUtils';
import {getOptions} from '../common/options/optionsUtils.js';
import {redirectIfApplicable} from '../features/redirect/core/index.js';

const kLoadMoreButtons = [
  {
    mode: 'in_batches',
    buttonSelectors: [
      '.thread-all-replies__load-more-button',
      '.scTailwindThreadMorebuttonload-more .scTailwindThreadMorebuttonbutton',
      '.scTailwindThreadMessagegapload-more .scTailwindThreadMessagegapbutton',
    ],
  },
  {
    mode: 'all_at_once',
    buttonSelectors: [
      '.thread-all-replies__load-all-button',
      '.scTailwindThreadMorebuttonload-all .scTailwindThreadMorebuttonbutton',
      '.scTailwindThreadMessagegapload-all .scTailwindThreadMessagegapbutton',
    ],
  }
];
const kMsgidDelay = 3500;

function main() {
  const ok = redirectIfApplicable();
  if (ok) return;

  getOptions(null).then(options => {
    setUpInfiniteScrollWithPotentialDelay(options);

    if (options.imagemaxheight)
      injectStylesheet(chrome.runtime.getURL('css/image_max_height.css'));
  });
}

var intersectionObserver;

function intersectionCallback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.click();
    }
  });
}

var intersectionOptions = {
  threshold: 1.0,
};

function setUpInfiniteScroll(options) {
  for (const entry of kLoadMoreButtons) {
    if (options.thread && options.thread_mode == entry.mode) {
      for (const selector of entry.buttonSelectors) {
        let buttons = document.querySelectorAll(selector);
        buttons.forEach(button => {
          intersectionObserver = new IntersectionObserver(
              intersectionCallback, intersectionOptions);
          intersectionObserver.observe(button);
        });
      }
    }
  }
}

function setUpInfiniteScrollWithPotentialDelay(options) {
  // If the msgid query parameter is set, the page will scroll to that message,
  // which will show the "load more" button.
  const params = new URLSearchParams(window.location.search);
  if (params.has('msgid')) {
    window.setTimeout(() => {
      setUpInfiniteScroll(options);
    }, kMsgidDelay);
  } else {
    setUpInfiniteScroll(options);
  }
}

main();
