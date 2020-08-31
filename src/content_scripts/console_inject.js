var mutationObserver, intersectionObserver, options;

function parseUrl(url) {
  var forum_a = url.match(/forum\/([0-9]+)/i);
  var thread_a = url.match(/thread\/([0-9]+)/i);

  if (forum_a === null || thread_a === null) {
    return false;
  }

  return {
    'forum': forum_a[1],
    'thread': thread_a[1],
  };
}

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == 'childList') {
      mutation.addedNodes.forEach(function(node) {
        if (typeof node.classList !== 'undefined') {
          if (options.thread && node.classList.contains('load-more-bar')) {
            intersectionObserver.observe(
                node.querySelector('.load-more-button'));
          }

          if (options.threadall && node.classList.contains('load-more-bar')) {
            intersectionObserver.observe(
                node.querySelector('.load-all-button'));
          }

          if (options.history && ('parentNode' in node) &&
              node.parentNode !== null && ('tagName' in node.parentNode) &&
              node.parentNode.tagName == 'EC-USER') {
            var nameElement = node.querySelector('.name span');
            if (nameElement !== null) {
              var name = nameElement.innerHTML;
              var query = encodeURIComponent(
                  '(creator:"' + name + '" | replier:"' + name + '") -forum:0');
              var urlpart = encodeURIComponent('query=' + query);
              var link = document.createElement('a');
              link.setAttribute(
                  'href',
                  'https://support.google.com/s/community/search/' + urlpart);
              link.innerText = chrome.i18n.getMessage('inject_previousposts');
              node.querySelector('.main-card-content')
                  .appendChild(document.createElement('br'));
              node.querySelector('.main-card-content').appendChild(link);
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

var observerOptions = {
  childList: true,
  attributes: true,
  subtree: true,
}

var intersectionOptions = {
  root: document.querySelector('.scrollable-content'),
  rootMargin: '0px',
  threshold: 1.0,
};

chrome.storage.sync.get(null, function(items) {
  options = items;

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(
      document.querySelector('.scrollable-content'), observerOptions);

  intersectionObserver =
      new IntersectionObserver(intersectionCallback, intersectionOptions);

  if (options.fixedtoolbar) {
    injectStyles(
        'ec-bulk-actions{position: sticky; top: 0; background: white; z-index: 96;}');
  }

  if (options.increasecontrast) {
    injectStyles('.thread-summary.read{background: #ecedee!important;}');
  }

  if (options.stickysidebarheaders) {
    injectStyles(
        'material-drawer .main-header{background: #fff; position: sticky; top: 0; z-index: 1;}');
  }

  if (options.profileindicator) {
    injectScript(
        chrome.runtime.getURL('injections/console_profileindicator_inject.js'));
    injectStylesheet(chrome.runtime.getURL(
        'injections/console_profileindicator_inject.css'));

    // In order to pass i18n strings to the injected script, which doesn't have
    // access to the chrome.i18n API.
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
});
