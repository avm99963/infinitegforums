import {injectStylesheet} from '../common/contentScriptsUtils.js';
import {getOptions} from '../common/optionsUtils.js';

var CCThreadWithoutMessage = /forum\/[0-9]*\/thread\/[0-9]*$/;

const kLoadMoreButtons = [
  {
    feature: 'thread',
    buttonSelectors: [
      '.thread-all-replies__load-more-button',
      '.scTailwindThreadMorebuttonload-more .scTailwindThreadMorebuttonbutton',
      '.scTailwindThreadMessagegapload-more .scTailwindThreadMessagegapbutton',
    ],
  },
  {
    feature: 'threadall',
    buttonSelectors: [
      '.thread-all-replies__load-all-button',
      '.scTailwindThreadMorebuttonload-all .scTailwindThreadMorebuttonbutton',
      '.scTailwindThreadMessagegapload-all .scTailwindThreadMessagegapbutton',
    ],
  }
];
const kMsgidDelay = 3500;

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

function setUpInfiniteScroll(options) {
  for (const entry of kLoadMoreButtons) {
    if (options[entry.feature]) {
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

getOptions(null).then(options => {
  var redirectLink = document.querySelector('.community-console');
  if (options.redirect && redirectLink !== null) {
    var redirectUrl = redirectLink.href;

    var searchParams = new URLSearchParams(location.search);
    if (searchParams.has('msgid') && searchParams.get('msgid') !== '' &&
        CCThreadWithoutMessage.test(redirectUrl))
      redirectUrl +=
          '/message/' + encodeURIComponent(searchParams.get('msgid'));

    window.location = redirectUrl;
  } else {
    setUpInfiniteScrollWithPotentialDelay(options);

    if (options.imagemaxheight)
      injectStylesheet(chrome.runtime.getURL('css/image_max_height.css'));
  }
});
