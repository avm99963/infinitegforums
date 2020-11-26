var mutationObserver, intersectionObserver, options, authuser;

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
  var authuserpart =
      (authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser));
  var container = document.createElement('div');
  container.style.margin = '3px 0';

  var link = document.createElement('a');
  link.setAttribute(
      'href',
      'https://support.google.com/s/community/search/' + urlpart +
          authuserpart);
  link.innerText = chrome.i18n.getMessage('inject_previousposts_' + type);

  container.appendChild(link);
  node.appendChild(container);
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

              var name = escapeUsername(nameElement.textContent);
              var query1 = encodeURIComponent(
                  '(creator:"' + name + '" | replier:"' + name +
                  '") forum:' + forumId);
              var query2 = encodeURIComponent(
                  '(creator:"' + name + '" | replier:"' + name +
                  '") forum:any');

              var container = document.createElement('div');
              container.classList.add('TWPT-previous-posts');

              var badge = document.createElement('div');
              badge.classList.add('TWPT-badge');
              badge.setAttribute(
                  'title',
                  chrome.i18n.getMessage(
                      'inject_extension_badge_helper',
                      [chrome.i18n.getMessage('appName')]));

              var badgeI = document.createElement('i');
              badgeI.classList.add(
                  'material-icon-i', 'material-icons-extended');
              badgeI.textContent = 'repeat';

              badge.appendChild(badgeI);
              container.appendChild(badge);

              var linkContainer = document.createElement('div');
              linkContainer.classList.add('TWPT-previous-posts--links');

              addProfileHistoryLink(linkContainer, 'forum', query1);
              addProfileHistoryLink(linkContainer, 'all', query2);

              container.appendChild(linkContainer);

              node.querySelector('.main-card-content').appendChild(container);
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

  var startup =
      JSON.parse(document.querySelector('html').getAttribute('data-startup'));
  authuser = startup[2][1] || '0';

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(
      document.querySelector('.scrollable-content'), observerOptions);

  intersectionObserver =
      new IntersectionObserver(intersectionCallback, intersectionOptions);

  if (options.fixedtoolbar) {
    injectStyles(
        'ec-bulk-actions{position: sticky; top: 0; background: var(--TWPT-primary-background, #fff); z-index: 96;}');
  }

  if (options.increasecontrast) {
    injectStyles(
        '.thread-summary.read:not(.checked){background: var(--TWPT-thread-read-background, #ecedee)!important;}');
  }

  if (options.stickysidebarheaders) {
    injectStyles(
        'material-drawer .main-header{background: var(--TWPT-drawer-background, #fff)!important; position: sticky; top: 0; z-index: 1;}');
  }

  if (options.ccdarktheme && options.ccdarktheme_mode == 'switch') {
    injectStylesheet(
        chrome.runtime.getURL('injections/ccdarktheme_switch.css'));

    var darkThemeSwitch = document.createElement('material-button');
    darkThemeSwitch.classList.add('TWPT-dark-theme');
    darkThemeSwitch.setAttribute('button', '');
    darkThemeSwitch.setAttribute(
        'title', chrome.i18n.getMessage('inject_ccdarktheme_helper'));

    darkThemeSwitch.addEventListener('click', e => {
      chrome.storage.sync.get(null, currentOptions => {
        currentOptions.ccdarktheme_switch_status =
            !options.ccdarktheme_switch_status;
        chrome.storage.sync.set(currentOptions, _ => {
          location.reload();
        });
      });
    });

    var switchContent = document.createElement('div');
    switchContent.classList.add('content');

    var icon = document.createElement('material-icon');

    var i = document.createElement('i');
    i.classList.add('material-icon-i', 'material-icons-extended');
    i.textContent = 'brightness_4';

    icon.appendChild(i);
    switchContent.appendChild(icon);
    darkThemeSwitch.appendChild(switchContent);

    var badgeContent = document.createElement('div');
    badgeContent.classList.add('TWPT-badge');
    badgeContent.setAttribute(
        'title', chrome.i18n.getMessage('inject_extension_badge_helper', [
          chrome.i18n.getMessage('appName')
        ]));

    var badgeI = document.createElement('i');
    badgeI.classList.add('material-icon-i', 'material-icons-extended');
    badgeI.textContent = 'repeat';

    badgeContent.appendChild(badgeI);
    darkThemeSwitch.appendChild(badgeContent);

    var rightControl = document.querySelector('header .right-control');
    rightControl.style.width =
        (parseInt(window.getComputedStyle(rightControl).width) + 58) + 'px';
    rightControl.insertAdjacentElement('afterbegin', darkThemeSwitch);
  }

  if (options.ccforcehidedrawer) {
    var drawer = document.querySelector('material-drawer');
    if (drawer !== null && drawer.classList.contains('mat-drawer-expanded')) {
      document.querySelector('.material-drawer-button').click();
    }
  }
});
