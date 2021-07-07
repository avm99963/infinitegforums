var mutationObserver, intersectionObserver, intersectionOptions, options,
    authuser;

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

function injectDarkModeButton(rightControl) {
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

  rightControl.style.width =
      (parseInt(window.getComputedStyle(rightControl).width) + 58) + 'px';
  rightControl.insertAdjacentElement('afterbegin', darkThemeSwitch);
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

  var duplicateBtn =
      readToggle.parentNode.querySelector('[debugid="mark-duplicate-button"]');
  if (duplicateBtn)
    duplicateBtn.parentNode.insertBefore(
        clone, (duplicateBtn.nextSibling || duplicateBtn));
  else
    readToggle.parentNode.insertBefore(
        clone, (readToggle.nextSibling || readToggle));
}

// TODO(avm99963): This is a prototype. DON'T FORGET TO ADD ERROR HANDLING.
function injectAvatars(node) {
  var header = node.querySelector(
      'ec-thread-summary .main-header .panel-description a.header');
  if (header === null) return;

  var link = parseUrl(header.href);
  if (link === false) return;

  var APIRequestUrl = 'https://support.google.com/s/community/api/ViewThread' +
      (authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser));

  fetch(APIRequestUrl, {
    'headers': {
      'content-type': 'text/plain; charset=utf-8',
    },
    'body': JSON.stringify({
      1: link.forum,
      2: link.thread,
      3: {
        1: {2: 15},
        3: true,
        5: true,
        10: true,
        16: true,
        18: true,
      }
    }),
    'method': 'POST',
    'mode': 'cors',
    'credentials': 'omit',
  })
      .then(res => {
        if (res.status == 200 || res.status == 400) {
          return res.json().then(data => ({
                                   status: res.status,
                                   body: data,
                                 }));
        } else {
          throw new Error('Status code ' + res.status + ' was not expected.');
        }
      })
      .then(res => {
        if (res.status == 400) {
          throw new Error(
              res.body[4] ||
              ('Response status: 400. Error code: ' + res.body[2]));
        }

        return res.body;
      })
      .then(data => {
        if (!('1' in data) || !('8' in data['1'])) return false;

        var messages = data['1']['8'];
        if (messages == 0) return;

        var avatarUrls = [];

        if (!('3' in data['1'])) return false;
        for (var m of data['1']['3']) {
          if (!('3' in m) || !('1' in m['3']) || !('2' in m['3']['1']))
            continue;

          var url = m['3']['1']['2'];

          if (!avatarUrls.includes(url)) avatarUrls.push(url);

          if (avatarUrls.length == 3) break;
        }

        var avatarsContainer = document.createElement('div');
        avatarsContainer.classList.add('TWPT-avatars');

        var count = Math.floor(Math.random() * 4);

        for (var i = 0; i < avatarUrls.length; ++i) {
          var avatar = document.createElement('div');
          avatar.classList.add('TWPT-avatar');
          avatar.style.backgroundImage = 'url(\'' + avatarUrls[i] + '\')';
          avatarsContainer.appendChild(avatar);
        }

        header.appendChild(avatarsContainer);
      });
}

var autoRefresh = {
  isLookingForUpdates: false,
  isUpdatePromptShown: false,
  lastTimestamp: null,
  filter: null,
  path: null,
  snackbar: null,
  interval: null,
  firstCallTimeout: null,
  intervalMs: 3 * 60 * 1000,   // 3 minutes
  firstCallDelayMs: 3 * 1000,  // 3 seconds
  getStartupData() {
    return JSON.parse(
        document.querySelector('html').getAttribute('data-startup'));
  },
  isOrderedByTimestampDescending() {
    var startup = this.getStartupData();
    // Returns orderOptions.by == TIMESTAMP && orderOptions.desc == true
    return (
        startup?.[1]?.[1]?.[3]?.[14]?.[1] == 1 &&
        startup?.[1]?.[1]?.[3]?.[14]?.[2] == true);
  },
  getCustomFilter(path) {
    var searchRegex = /^\/s\/community\/search\/([^\/]*)/;
    var matches = path.match(searchRegex);
    if (matches !== null && matches.length > 1) {
      var search = decodeURIComponent(matches[1]);
      var params = new URLSearchParams(search);
      return params.get('query') || '';
    }

    return '';
  },
  filterHasOverride(filter, override) {
    var escapedOverride = override.replace(/([^\w\d\s])/gi, '\\$1');
    var regex = new RegExp('[^a-zA-Z0-9]?' + escapedOverride + ':');
    return regex.test(filter);
  },
  getFilter(path) {
    var query = this.getCustomFilter(path);

    // Note: This logic has been copied and adapted from the
    // _buildQuery$1$threadId function in the Community Console
    var conditions = '';
    var startup = this.getStartupData();

    // TODO(avm99963): if the selected forums are changed without reloading the
    // page, this will get the old selected forums. Fix this.
    var forums = startup?.[1]?.[1]?.[3]?.[8] ?? [];
    if (!this.filterHasOverride(query, 'forum') && forums !== null &&
        forums.length > 0)
      conditions += ' forum:(' + forums.join(' | ') + ')';

    var langs = startup?.[1]?.[1]?.[3]?.[5] ?? [];
    if (!this.filterHasOverride(query, 'lang') && langs !== null &&
        langs.length > 0)
      conditions += ' lang:(' + langs.map(l => '"' + l + '"').join(' | ') + ')';

    if (query.length !== 0 && conditions.length !== 0)
      return '(' + query + ')' + conditions;
    return query + conditions;
  },
  getLastTimestamp() {
    var APIRequestUrl = 'https://support.google.com/s/community/api/ViewForum' +
        (authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser));

    return fetch(APIRequestUrl, {
             'headers': {
               'content-type': 'text/plain; charset=utf-8',
             },
             'body': JSON.stringify({
               1: '0',  // TODO: Change, when only a forum is selected, it
                        // should be set here
               2: {
                 1: {
                   2: 2,
                 },
                 2: {
                   1: 1,
                   2: true,
                 },
                 12: this.filter,
               },
             }),
             'method': 'POST',
             'mode': 'cors',
             'credentials': 'include',
           })
        .then(res => {
          if (res.status == 200 || res.status == 400) {
            return res.json().then(data => ({
                                     status: res.status,
                                     body: data,
                                   }));
          } else {
            throw new Error('Status code ' + res.status + ' was not expected.');
          }
        })
        .then(res => {
          if (res.status == 400) {
            throw new Error(
                res.body[4] ||
                ('Response status: 400. Error code: ' + res.body[2]));
          }

          return res.body;
        })
        .then(body => {
          var timestamp = body?.[1]?.[2]?.[0]?.[2]?.[17];
          if (timestamp === undefined)
            throw new Error(
                'Unexpected body of response (' +
                (body?.[1]?.[2]?.[0] === undefined ?
                     'no threads were returned' :
                     'the timestamp value is not present in the first thread') +
                ').');

          return timestamp;
        });
    // TODO(avm99963): Add retry mechanism (sometimes thread lists are empty,
    // but when loading the next page the thread appears).
    //
    // NOTE(avm99963): It seems like loading the first 2 threads instead of only
    // the first one fixes this (empty lists are now rarely returned).
  },
  unregister() {
    console.debug('autorefresh_list: unregistering');

    if (!this.isLookingForUpdates) return;

    window.clearTimeout(this.firstCallTimeout);
    window.clearInterval(this.interval);
    this.isUpdatePromptShown = false;
    this.isLookingForUpdates = false;
  },
  showUpdatePrompt() {
    this.snackbar.classList.remove('TWPT-hidden');
    document.title = '[!!!] ' + document.title.replace('[!!!] ', '');
    this.isUpdatePromptShown = true;
  },
  hideUpdatePrompt() {
    this.snackbar.classList.add('TWPT-hidden');
    document.title = document.title.replace('[!!!] ', '');
    this.isUpdatePromptShown = false;
  },
  injectUpdatePrompt() {
    var pane = document.createElement('div');
    pane.classList.add('TWPT-pane-for-snackbar');

    var snackbar = document.createElement('material-snackbar-panel');
    snackbar.classList.add('TWPT-snackbar');
    snackbar.classList.add('TWPT-hidden');

    var ac = document.createElement('div');
    ac.classList.add('TWPT-animation-container');

    var nb = document.createElement('div');
    nb.classList.add('TWPT-notification-bar');

    var ft = document.createElement('focus-trap');

    var content = document.createElement('div');
    content.classList.add('TWPT-focus-content-wrapper');

    var badge = createExtBadge();

    var message = document.createElement('div');
    message.classList.add('TWPT-message');
    message.textContent =
        chrome.i18n.getMessage('inject_autorefresh_list_snackbar_message');

    var action = document.createElement('div');
    action.classList.add('TWPT-action');
    action.textContent =
        chrome.i18n.getMessage('inject_autorefresh_list_snackbar_action');

    action.addEventListener('click', e => {
      this.hideUpdatePrompt();
      document.querySelector('.app-title-button').click();
    });

    content.append(badge, message, action);
    ft.append(content);
    nb.append(ft);
    ac.append(nb);
    snackbar.append(ac);
    pane.append(snackbar);
    document.getElementById('default-acx-overlay-container').append(pane);
    this.snackbar = snackbar;
  },
  checkUpdate() {
    if (location.pathname != this.path) {
      this.unregister();
      return;
    }

    if (this.isUpdatePromptShown) return;

    console.debug('Checking for update at: ', new Date());

    this.getLastTimestamp()
        .then(timestamp => {
          if (timestamp != this.lastTimestamp) this.showUpdatePrompt();
        })
        .catch(
            err => console.error(
                'Coudln\'t get last timestamp (while updating): ', err));
  },
  firstCall() {
    console.debug(
        'autorefresh_list: now performing first call to finish setup (filter: [' +
        this.filter + '])');

    if (location.pathname != this.path) {
      this.unregister();
      return;
    }

    this.getLastTimestamp()
        .then(timestamp => {
          this.lastTimestamp = timestamp;
          var checkUpdateCallback = this.checkUpdate.bind(this);
          this.interval =
              window.setInterval(checkUpdateCallback, this.intervalMs);
        })
        .catch(
            err => console.error(
                'Couldn\'t get last timestamp (while setting up): ', err));
  },
  setUp() {
    if (!this.isOrderedByTimestampDescending()) return;

    this.unregister();

    console.debug('autorefresh_list: starting set up...');

    if (this.snackbar === null) this.injectUpdatePrompt();
    this.isLookingForUpdates = true;
    this.path = location.pathname;
    this.filter = this.getFilter(this.path);

    var firstCall = this.firstCall.bind(this);
    this.firstCallTimeout = window.setTimeout(firstCall, this.firstCallDelayMs);
  },
};

function isDarkThemeOn() {
  if (!options.ccdarktheme) return false;

  if (options.ccdarktheme_mode == 'switch')
    return options.ccdarktheme_switch_status;

  return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
}

var unifiedProfilesFix = {
  checkIframe(iframe) {
    var srcRegex = /support.*\.google\.com\/profile\//;
    return srcRegex.test(iframe.src ?? '');
  },
  fixIframe(iframe) {
    console.info('[unifiedProfilesFix] Fixing unified profiles iframe');
    var url = new URL(iframe.src);
    url.searchParams.set('dark', 1);
    iframe.src = url.href;
  },
};

function injectPreviousPostsLinks(nameElement) {
  var mainCardContent = getNParent(nameElement, 3);
  if (mainCardContent === null) {
    console.error(
        '[previousposts] Couldn\'t find |.main-card-content| element.');
    return;
  }

  var forumId = location.href.split('/forum/')[1].split('/')[0] || '0';

  var nameTag =
      (nameElement.tagName == 'EC-DISPLAY-NAME-EDITOR' ?
           nameElement.querySelector('.top-section > span') ?? nameElement :
           nameElement);
  var name = escapeUsername(nameTag.textContent);
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

// Send a request to mark the current thread as read
function markCurrentThreadAsRead() {
  console.debug(
      '[forceMarkAsRead] %cTrying to mark a thread as read.',
      'color: #1a73e8;');

  var threadRegex =
      /\/s\/community\/?.*\/forum\/([0-9]+)\/?.*\/thread\/([0-9]+)/;

  var url = location.href;
  var matches = url.match(threadRegex);
  if (matches !== null && matches.length > 2) {
    var forumId = matches[1];
    var threadId = matches[2];

    console.debug('[forceMarkAsRead] Thread details:', {forumId, threadId});

    return CCApi(
               'ViewThread', {
                 1: forumId,
                 2: threadId,
                 // options
                 3: {
                   // pagination
                   1: {
                     2: 0,  // maxNum
                   },
                   3: false,   // withMessages
                   5: false,   // withUserProfile
                   6: true,    // withUserReadState
                   9: false,   // withRequestorProfile
                   10: false,  // withPromotedMessages
                   11: false,  // withExpertResponder
                 },
               },
               authuser)
        .then(thread => {
          if (thread?.[1]?.[6] === true) {
            console.debug(
                '[forceMarkAsRead] This thread is already marked as read, but marking it as read anyways.');
          }

          var lastMessageId = thread?.[1]?.[2]?.[10];

          console.debug('[forceMarkAsRead] lastMessageId is:', lastMessageId);

          if (lastMessageId === undefined)
            throw new Error(
                'Couldn\'t find lastMessageId in the ViewThread response.');

          return CCApi(
              'SetUserReadStateBulk', {
                1: [{
                  1: forumId,
                  2: threadId,
                  3: lastMessageId,
                }],
              },
              authuser);
        })
        .then(_ => {
          console.debug(
              '[forceMarkAsRead] %cSuccessfully set as read!',
              'color: #1e8e3e;');
        })
        .catch(err => {
          console.error(
              '[forceMarkAsRead] Error while marking current thread as read: ',
              err);
        });
  } else {
    console.error(
        '[forceMarkAsRead] Couldn\'t retrieve forumId and threadId from the current URL.',
        url);
  }
}

const watchedNodesSelectors = [
  // App container (used to set up the intersection observer and inject the dark
  // mode button)
  'ec-app',

  // Load more bar (for the "load more"/"load all" buttons)
  '.load-more-bar',

  // Username span/editor inside ec-user (user profile view)
  'ec-user .main-card .header > .name > span',
  'ec-user .main-card .header > .name > ec-display-name-editor',

  // Rich text editor
  'ec-movable-dialog',
  'ec-rich-text-editor',

  // Read/unread bulk action in the list of thread, for the batch lock feature
  'ec-bulk-actions material-button[debugid="mark-read-button"]',
  'ec-bulk-actions material-button[debugid="mark-unread-button"]',

  // Thread list items (used to inject the avatars)
  'li',

  // Thread list (used for the autorefresh feature)
  'ec-thread-list',

  // Unified profile iframe
  'iframe',

  // Thread component
  'ec-thread',
];

function handleCandidateNode(node) {
  if (typeof node.classList !== 'undefined') {
    if (('tagName' in node) && node.tagName == 'EC-APP') {
      // Set up the intersectionObserver
      if (typeof intersectionObserver === 'undefined') {
        var scrollableContent = node.querySelector('.scrollable-content');
        if (scrollableContent !== null) {
          intersectionOptions = {
            root: scrollableContent,
            rootMargin: '0px',
            threshold: 1.0,
          };

          intersectionObserver = new IntersectionObserver(
              intersectionCallback, intersectionOptions);
        }
      }

      // Inject the dark mode button
      if (options.ccdarktheme && options.ccdarktheme_mode == 'switch') {
        var rightControl = node.querySelector('header .right-control');
        if (rightControl !== null) injectDarkModeButton(rightControl);
      }
    }

    // Start the intersectionObserver for the "load more"/"load all" buttons
    // inside a thread
    if ((options.thread || options.threadall) &&
        node.classList.contains('load-more-bar')) {
      if (typeof intersectionObserver !== 'undefined') {
        if (options.thread)
          intersectionObserver.observe(node.querySelector('.load-more-button'));
        if (options.threadall)
          intersectionObserver.observe(node.querySelector('.load-all-button'));
      } else {
        console.warn(
            '[infinitescroll] ' +
            'The intersectionObserver is not ready yet.');
      }
    }

    // Show the "previous posts" links
    //   Here we're selecting the 'ec-user > div' element (unique child)
    if (options.history &&
        (node.matches('ec-user .main-card .header > .name > span') ||
         node.matches(
             'ec-user .main-card .header > .name > ec-display-name-editor'))) {
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

    // Inject avatar links to threads in the thread list
    if (options.threadlistavatars && ('tagName' in node) &&
        (node.tagName == 'LI') &&
        node.querySelector('ec-thread-summary') !== null) {
      injectAvatars(node);
    }

    // Set up the autorefresh list feature
    if (options.autorefreshlist && ('tagName' in node) &&
        node.tagName == 'EC-THREAD-LIST') {
      autoRefresh.setUp();
    }

    // Redirect unified profile iframe to dark version if applicable
    if (node.tagName == 'IFRAME' && isDarkThemeOn() &&
        unifiedProfilesFix.checkIframe(node)) {
      unifiedProfilesFix.fixIframe(node);
    }

    // Force mark thread as read
    if (options.forcemarkasread && node.tagName == 'EC-THREAD') {
      markCurrentThreadAsRead();
    }
  }
}

function handleRemovedNode(node) {
  // Remove snackbar when exiting thread list view
  if (options.autorefreshlist && 'tagName' in node &&
      node.tagName == 'EC-THREAD-LIST') {
    autoRefresh.hideUpdatePrompt();
  }
}

function mutationCallback(mutationList, observer) {
  mutationList.forEach((mutation) => {
    if (mutation.type == 'childList') {
      mutation.addedNodes.forEach(function(node) {
        handleCandidateNode(node);
      });

      mutation.removedNodes.forEach(function(node) {
        handleRemovedNode(node);
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
};

chrome.storage.sync.get(null, function(items) {
  options = items;

  var startup =
      JSON.parse(document.querySelector('html').getAttribute('data-startup'));
  authuser = startup[2][1] || '0';

  // Before starting the mutation Observer, check whether we missed any
  // mutations by manually checking whether some watched nodes already
  // exist.
  var cssSelectors = watchedNodesSelectors.join(',');
  document.querySelectorAll(cssSelectors)
      .forEach(node => handleCandidateNode(node));

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document.body, observerOptions);

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

  if (options.enhancedannouncementsdot) {
    injectStylesheet(
        chrome.runtime.getURL('injections/enhanced_announcements_dot.css'));
  }

  if (options.repositionexpandthread) {
    injectStylesheet(
        chrome.runtime.getURL('injections/reposition_expand_thread.css'));
  }

  if (options.ccforcehidedrawer) {
    var drawer = document.querySelector('material-drawer');
    if (drawer !== null && drawer.classList.contains('mat-drawer-expanded')) {
      document.querySelector('.material-drawer-button').click();
    }
  }

  if (options.batchlock) {
    injectScript(chrome.runtime.getURL('injections/batchlock_inject.js'));
    injectStylesheet(chrome.runtime.getURL('injections/batchlock_inject.css'));
  }

  if (options.threadlistavatars) {
    injectStylesheet(
        chrome.runtime.getURL('injections/thread_list_avatars.css'));
  }

  if (options.autorefreshlist) {
    injectStylesheet(chrome.runtime.getURL('injections/autorefresh_list.css'));
  }
});
