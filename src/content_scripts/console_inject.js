var mutationObserver, intersectionObserver, options, authuser;

function removeChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function getNParent(node, n) {
  if (n <= 0) return node;
  if (!('parentNode' in node)) return null;
  return getNParent(node.parentNode, n - 1);
}

function createExtBadge() {
  var badge = document.createElement('div');
  badge.classList.add('TWPT-badge');
  badge.setAttribute(
      'title', chrome.i18n.getMessage('inject_extension_badge_helper', [
        chrome.i18n.getMessage('appName')
      ]));

  var badgeI = document.createElement('i');
  badgeI.classList.add('material-icon-i', 'material-icons-extended');
  badgeI.textContent = 'repeat';

  badge.append(badgeI);
  return badge;
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

function applyDragAndDropFix(node) {
  console.debug('Adding link drag&drop fix to ', node);
  node.addEventListener('drop', e => {
    if (e.dataTransfer.types.includes('text/uri-list')) {
      e.stopImmediatePropagation();
      console.debug('Stopping link drop event propagation.');
    }
  }, true);
}

function nodeIsReadToggleBtn(node) {
  return ('tagName' in node) && node.tagName == 'MATERIAL-BUTTON' &&
      node.getAttribute('debugid') !== null &&
      (node.getAttribute('debugid') == 'mark-read-button' ||
       node.getAttribute('debugid') == 'mark-unread-button') &&
      ('parentNode' in node) && node.parentNode !== null &&
      ('parentNode' in node.parentNode) &&
      node.parentNode.querySelector('[debugid="batchlock"]') === null &&
      node.parentNode.parentNode !== null &&
      ('tagName' in node.parentNode.parentNode) &&
      node.parentNode.parentNode.tagName == 'EC-BULK-ACTIONS';
}

function addBatchLockBtn(readToggle) {
  var clone = readToggle.cloneNode(true);
  clone.setAttribute('debugid', 'batchlock');
  clone.classList.add('TWPT-btn--with-badge');
  clone.setAttribute('title', chrome.i18n.getMessage('inject_lockbtn'));
  clone.querySelector('material-icon').setAttribute('icon', 'lock');
  clone.querySelector('i.material-icon-i').textContent = 'lock';

  var badge = createExtBadge();
  clone.append(badge);

  clone.addEventListener('click', function() {
    var modal = document.querySelector('.pane[pane-id="default-1"]');

    var dialog = document.createElement('material-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.classList.add('TWPT-dialog');

    var header = document.createElement('header');
    header.setAttribute('role', 'presentation');
    header.classList.add('TWPT-dialog-header');

    var title = document.createElement('div');
    title.classList.add('TWPT-dialog-header--title', 'title');
    title.textContent = chrome.i18n.getMessage('inject_lockbtn');

    header.append(title);

    var main = document.createElement('main');
    main.setAttribute('role', 'presentation');
    main.classList.add('TWPT-dialog-main');

    var p = document.createElement('p');
    p.textContent = chrome.i18n.getMessage('inject_lockdialog_desc');

    main.append(p);

    dialog.append(header, main);

    var footers = [['lock', 'unlock', 'cancel'], ['reload', 'close']];

    for (var i = 0; i < footers.length; ++i) {
      var footer = document.createElement('footer');
      footer.setAttribute('role', 'presentation');
      footer.classList.add('TWPT-dialog-footer');
      footer.setAttribute('data-footer-id', i);

      if (i > 0) footer.classList.add('is-hidden');

      footers[i].forEach(action => {
        var btn = document.createElement('material-button');
        btn.setAttribute('role', 'button');
        btn.classList.add('TWPT-dialog-footer-btn');
        if (i == 1) btn.classList.add('is-disabled');

        switch (action) {
          case 'lock':
          case 'unlock':
            btn.addEventListener('click', _ => {
              if (btn.classList.contains('is-disabled')) return;
              var message = {
                action,
                prefix: 'TWPT-batchlock',
              };
              window.postMessage(message, '*');
            });
            break;

          case 'cancel':
          case 'close':
            btn.addEventListener('click', _ => {
              if (btn.classList.contains('is-disabled')) return;
              modal.classList.remove('visible');
              modal.style.display = 'none';
              removeChildNodes(modal);
            });
            break;

          case 'reload':
            btn.addEventListener('click', _ => {
              if (btn.classList.contains('is-disabled')) return;
              window.location.reload()
            });
            break;
        }

        var content = document.createElement('div');
        content.classList.add('content', 'TWPT-dialog-footer-btn--content');
        content.textContent =
            chrome.i18n.getMessage('inject_lockdialog_btn_' + action);

        btn.append(content);
        footer.append(btn);
      });

      var clear = document.createElement('div');
      clear.style.clear = 'both';

      footer.append(clear);
      dialog.append(footer);
    }

    removeChildNodes(modal);
    modal.append(dialog);
    modal.classList.add('visible', 'modal');
    modal.style.display = 'flex';
  });
  readToggle.parentNode.insertBefore(
      clone, (readToggle.nextSibling || readToggle));
}

function injectPreviousPostsLinks(nameElement) {
  var mainCardContent = getNParent(nameElement, 3);
  if (mainCardContent === null) {
    console.error(
        '[previousposts] Couldn\'t find |.main-card-content| element.');
    return;
  }

  var forumId = location.href.split('/forum/')[1].split('/')[0] || '0';

  var name = escapeUsername(nameElement.textContent);
  var query1 = encodeURIComponent(
      '(creator:"' + name + '" | replier:"' + name + '") forum:' + forumId);
  var query2 = encodeURIComponent(
      '(creator:"' + name + '" | replier:"' + name + '") forum:any');

  var container = document.createElement('div');
  container.classList.add('TWPT-previous-posts');

  var badge = createExtBadge();
  container.appendChild(badge);

  var linkContainer = document.createElement('div');
  linkContainer.classList.add('TWPT-previous-posts--links');

  addProfileHistoryLink(linkContainer, 'forum', query1);
  addProfileHistoryLink(linkContainer, 'all', query2);

  container.appendChild(linkContainer);

  mainCardContent.appendChild(container);
}

const watchedNodesSelectors = [
  // Load more bar (for the "load more"/"load all" buttons)
  '.load-more-bar',

  // Username span inside ec-user (user profile view)
  'ec-user .main-card .header > .name > span',

  // Rich text editor
  'ec-movable-dialog',
  'ec-rich-text-editor',

  // Read/unread bulk action in the list of thread, for the batch lock feature
  'ec-bulk-actions material-button[debugid="mark-read-button"]',
  'ec-bulk-actions material-button[debugid="mark-unread-button"]',
];

function handleCandidateNode(node) {
  if (typeof node.classList !== 'undefined') {
    // Set up the intersectionObserver for the "load more" button inside a
    // thread
    if (options.thread && node.classList.contains('load-more-bar')) {
      intersectionObserver.observe(node.querySelector('.load-more-button'));
    }

    // Set up the intersectionObserver for the "load all" button inside a thread
    if (options.threadall && node.classList.contains('load-more-bar')) {
      intersectionObserver.observe(node.querySelector('.load-all-button'));
    }

    // Show the "previous posts" links
    //   Here we're selecting the 'ec-user > div' element (unique child)
    if (options.history &&
        node.matches('ec-user .main-card .header > .name > span')) {
      injectPreviousPostsLinks(node);
    }

    // Fix the drag&drop issue with the rich text editor
    //
    //   We target both tags because in different contexts different
    //   elements containing the text editor get added to the DOM structure.
    //   Sometimes it's a EC-MOVABLE-DIALOG which already contains the
    //   EC-RICH-TEXT-EDITOR, and sometimes it's the EC-RICH-TEXT-EDITOR
    //   directly.
    if (options.ccdragndropfix && ('tagName' in node) &&
        (node.tagName == 'EC-MOVABLE-DIALOG' ||
         node.tagName == 'EC-RICH-TEXT-EDITOR')) {
      applyDragAndDropFix(node);
    }

    // Inject the batch lock button in the thread list
    if (options.batchlock && nodeIsReadToggleBtn(node)) {
      addBatchLockBtn(node);
    }
  }
}

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == 'childList') {
      mutation.addedNodes.forEach(function(node) {
        handleCandidateNode(node);
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

  // Before starting the mutation Observer, check whether we missed any
  // mutations by manually checking whether some watched nodes already exist.
  var cssSelectors = watchedNodesSelectors.join(',');
  document.querySelectorAll(cssSelectors)
      .forEach(node => handleCandidateNode(node));

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document.body, observerOptions);

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
    var darkThemeSwitch = document.createElement('material-button');
    darkThemeSwitch.classList.add('TWPT-dark-theme', 'TWPT-btn--with-badge');
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

    var badgeContent = createExtBadge();

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

  if (options.batchlock) {
    injectScript(chrome.runtime.getURL('injections/batchlock_inject.js'));
  }
});
