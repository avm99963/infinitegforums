import {injectScript, injectStyles, injectStylesheet} from '../../common/contentScriptsUtils.js';

import {autoRefresh} from './autoRefresh.js';
import AvatarsHandler from './avatars.js';
import {addBatchLockBtn, nodeIsReadToggleBtn} from './batchLock.js';
import {injectDarkModeButton, isDarkThemeOn} from './darkMode.js';
import {applyDragAndDropFix} from './dragAndDropFix.js';
import {markCurrentThreadAsRead} from './forceMarkAsRead.js';
import {injectPreviousPostsLinks} from './profileHistoryLink.js';
import {unifiedProfilesFix} from './unifiedProfiles.js';

var mutationObserver, intersectionObserver, intersectionOptions, options, avatars;

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
        if (rightControl !== null)
          injectDarkModeButton(rightControl, options.ccdarktheme_switch_status);
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
      avatars.inject(node);
    }

    // Set up the autorefresh list feature
    if (options.autorefreshlist && ('tagName' in node) &&
        node.tagName == 'EC-THREAD-LIST') {
      autoRefresh.setUp();
    }

    // Redirect unified profile iframe to dark version if applicable
    if (node.tagName == 'IFRAME' && isDarkThemeOn(options) &&
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

  // Initialize classes needed by the mutation observer
  if (options.threadlistavatars)
    avatars = new AvatarsHandler();

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
        chrome.runtime.getURL('css/enhanced_announcements_dot.css'));
  }

  if (options.repositionexpandthread) {
    injectStylesheet(chrome.runtime.getURL('css/reposition_expand_thread.css'));
  }

  if (options.ccforcehidedrawer) {
    var drawer = document.querySelector('material-drawer');
    if (drawer !== null && drawer.classList.contains('mat-drawer-expanded')) {
      document.querySelector('.material-drawer-button').click();
    }
  }

  if (options.batchlock) {
    injectScript(chrome.runtime.getURL('batchLockInject.bundle.js'));
    injectStylesheet(chrome.runtime.getURL('css/batchlock_inject.css'));
  }

  if (options.threadlistavatars) {
    injectStylesheet(chrome.runtime.getURL('css/thread_list_avatars.css'));
  }

  if (options.autorefreshlist) {
    injectStylesheet(chrome.runtime.getURL('css/autorefresh_list.css'));
  }
});
