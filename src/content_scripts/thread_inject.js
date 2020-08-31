var intersectionObserver;

function injectStylesheet(stylesheetName) {
  var link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', stylesheetName);
  document.head.appendChild(link);
}

function injectStyles(css) {
  injectStylesheet('data:text/css;charset=UTF-8,' + encodeURIComponent(css));
}

function injectScript(scriptName) {
  var script = document.createElement('script');
  script.src = scriptName;
  document.head.appendChild(script);
}

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

chrome.storage.sync.get(null, function(items) {
  var path = document.location.pathname.split('/');
  if (path[path.length - 1] == 'new' ||
      (path.length > 1 && path[path.length - 1] == '' &&
       path[path.length - 2] == 'new')) {
    return;
  }

  var redirectLink = document.querySelector('.community-console');
  if (items.redirect && redirectLink !== null) {
    window.location = redirectLink.href;
  } else {
    var button =
        document.querySelector('.thread-all-replies__load-more-button');
    if (items.thread && button !== null) {
      intersectionObserver =
          new IntersectionObserver(intersectionCallback, intersectionOptions);
      intersectionObserver.observe(button);
    }
    var allbutton =
        document.querySelector('.thread-all-replies__load-all-button');
    if (items.threadall && button !== null) {
      intersectionObserver =
          new IntersectionObserver(intersectionCallback, intersectionOptions);
      intersectionObserver.observe(allbutton);
    }

    if (items.profileindicator) {
      injectScript(
          chrome.runtime.getURL('injections/profileindicator_inject.js'));
      injectStylesheet(
          chrome.runtime.getURL('injections/profileindicator_inject.css'));

      // In order to pass i18n strings to the injected script, which doesn't
      // have access to the chrome.i18n API.
      window.addEventListener('geti18nString', evt => {
        var request = evt.detail;
        var response = {
          string: chrome.i18n.getMessage(request.msg),
          requestId: request.id
        };
        window.dispatchEvent(
            new CustomEvent('sendi18nString', {detail: response}));
      });
    }
  }
});
