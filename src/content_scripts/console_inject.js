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

function addProfileHistoryLink(node, type, query) {
  var urlpart = encodeURIComponent('query=' + query);
  var container = document.createElement('div');
  container.style.margin = '3px 0';

  var link = document.createElement('a');
  link.setAttribute(
      'href', 'https://support.google.com/s/community/search/' + urlpart);
  link.innerText = chrome.i18n.getMessage('inject_previousposts_' + type);

  container.appendChild(link);
  node.querySelector('.main-card-content').appendChild(container);
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
              var forumId =
                  location.href.split('/forum/')[1].split('/')[0] || '0';

              var name = escapeUsername(nameElement.innerHTML);
              var query1 = encodeURIComponent(
                  '(creator:"' + name + '" | replier:"' + name +
                  '") forum:' + forumId);
              var query2 = encodeURIComponent(
                  '(creator:"' + name + '" | replier:"' + name +
                  '") forum:any');
              addProfileHistoryLink(node, 'forum', query1);
              addProfileHistoryLink(node, 'all', query2);
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
});
