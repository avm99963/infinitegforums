import {getOptions} from '../common/optionsUtils.js';

var CCThreadWithoutMessage = /forum\/[0-9]*\/thread\/[0-9]*$/;

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
    var button =
        document.querySelector('.thread-all-replies__load-more-button');
    if (options.thread && button !== null) {
      intersectionObserver =
          new IntersectionObserver(intersectionCallback, intersectionOptions);
      intersectionObserver.observe(button);
    }
    var allbutton =
        document.querySelector('.thread-all-replies__load-all-button');
    if (options.threadall && button !== null) {
      intersectionObserver =
          new IntersectionObserver(intersectionCallback, intersectionOptions);
      intersectionObserver.observe(allbutton);
    }
  }
});
