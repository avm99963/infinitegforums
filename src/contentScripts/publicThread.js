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
    for (const entry of kLoadMoreButtons)
      if (options[entry.feature])
        for (const selector of entry.buttonSelectors) {
          let button = document.querySelector(selector);
          if (button !== null) {
            intersectionObserver = new IntersectionObserver(
                intersectionCallback, intersectionOptions);
            intersectionObserver.observe(button);
          }
        }

    if (options.imagemaxheight)
      injectStylesheet(chrome.runtime.getURL('css/image_max_height.css'));
  }
});
