import {injectScript, injectStyles, injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getOptions, isOptionEnabled} from '../../common/optionsUtils.js';
import {injectPreviousPostsLinksUnifiedProfileIfEnabled} from '../utilsCommon/unifiedProfiles.js';

import AvatarsHandler from './avatars.js';
import {batchLock} from './batchLock.js';
import {injectDarkModeButton, isDarkThemeOn} from './darkMode.js';
import {applyDragAndDropFixIfEnabled} from './dragAndDropFix.js';
import {injectPreviousPostsLinksIfEnabled} from './profileHistoryLink.js';
import {unifiedProfilesFix} from './unifiedProfiles.js';

var mutationObserver, intersectionObserver, intersectionOptions, options,
    avatars;

const watchedNodesSelectors = [
  // App container (used to set up the intersection observer and inject the dark
  // mode button)
  'ec-app',

  // Load more bar (for the "load more"/"load all" buttons)
  '.load-more-bar',

  // Username span/editor inside ec-user (user profile view)
  'ec-user .main-card .header > .name > span',
  'ec-user .main-card .header > .name > ec-display-name-editor',
  'ec-unified-user .scTailwindUser_profileUsercarddetails',

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
      // TODO(avm99963): make this feature dynamic.
      if (options.ccdarktheme && options.ccdarktheme_mode == 'switch') {
        var rightControl = node.querySelector('header .right-control');
        if (rightControl !== null)
          injectDarkModeButton(rightControl, options.ccdarktheme_switch_status);
      }
    }

    // Start the intersectionObserver for the "load more"/"load all" buttons
    // inside a thread if the option is currently enabled.
    if (node.classList.contains('load-more-bar')) {
      if (typeof intersectionObserver !== 'undefined') {
        getOptions(['thread', 'threadall']).then(threadOptions => {
          if (threadOptions.thread)
            intersectionObserver.observe(
                node.querySelector('.load-more-button'));
          if (threadOptions.threadall)
            intersectionObserver.observe(
                node.querySelector('.load-all-button'));
        });
      } else {
        console.warn(
            '[infinitescroll] ' +
            'The intersectionObserver is not ready yet.');
      }
    }

    // Show the "previous posts" links if the option is currently enabled.
    //   Here we're selecting the 'ec-user > div' element (unique child)

    // TODO(b/twpowertools/80): Remove this:
    if (node.matches('ec-user .main-card .header > .name > span') ||
        node.matches(
            'ec-user .main-card .header > .name > ec-display-name-editor')) {
      injectPreviousPostsLinksIfEnabled(node);
    }

    if (node.matches(
            'ec-unified-user .scTailwindUser_profileUsercarddetails')) {
      injectPreviousPostsLinksUnifiedProfileIfEnabled(
          /* isCommunityConsole = */ true);
    }

    // Fix the drag&drop issue with the rich text editor if the option is
    // currently enabled.
    //
    //   We target both tags because in different contexts different
    //   elements containing the text editor get added to the DOM structure.
    //   Sometimes it's a EC-MOVABLE-DIALOG which already contains the
    //   EC-RICH-TEXT-EDITOR, and sometimes it's the EC-RICH-TEXT-EDITOR
    //   directly.
    if (('tagName' in node) &&
        (node.tagName == 'EC-MOVABLE-DIALOG' ||
         node.tagName == 'EC-RICH-TEXT-EDITOR')) {
      applyDragAndDropFixIfEnabled(node);
    }

    // Inject the batch lock button in the thread list if the option is
    // currently enabled.
    if (batchLock.nodeIsReadToggleBtn(node)) {
      batchLock.addButtonIfEnabled(node);
    }

    // Inject avatar links to threads in the thread list. injectIfEnabled is
    // responsible of determining whether it should run or not depending on its
    // current setting.
    if (('tagName' in node) && (node.tagName == 'LI') &&
        node.querySelector('ec-thread-summary') !== null) {
      avatars.injectIfEnabled(node);
    }

    // Set up the autorefresh list feature. The setUp function is responsible
    // of determining whether it should run or not depending on the current
    // setting.
    if (('tagName' in node) && node.tagName == 'EC-THREAD-LIST') {
      window.TWPTAutoRefresh.setUp();
    }

    // Redirect unified profile iframe to dark version if applicable
    if (node.tagName == 'IFRAME' && isDarkThemeOn(options) &&
        unifiedProfilesFix.checkIframe(node)) {
      unifiedProfilesFix.fixIframe(node);
    }
  }
}

function handleRemovedNode(node) {
  // Remove snackbar when exiting thread list view
  if ('tagName' in node && node.tagName == 'EC-THREAD-LIST') {
    window.TWPTAutoRefresh.hideUpdatePrompt();
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

getOptions(null).then(items => {
  options = items;

  // Initialize classes needed by the mutation observer
  avatars = new AvatarsHandler();

  // autoRefresh is initialized in start.js

  // Before starting the mutation Observer, check whether we missed any
  // mutations by manually checking whether some watched nodes already
  // exist.
  var cssSelectors = watchedNodesSelectors.join(',');
  document.querySelectorAll(cssSelectors)
      .forEach(node => handleCandidateNode(node));

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document.body, observerOptions);

  // TODO(avm99963): The following features are not dynamic. Make them be.
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

  if (options.imagemaxheight) {
    injectStylesheet(chrome.runtime.getURL('css/image_max_height.css'));
  }

  if (options.ccforcehidedrawer) {
    var drawer = document.querySelector('material-drawer');
    if (drawer !== null && drawer.classList.contains('mat-drawer-expanded')) {
      document.querySelector('.material-drawer-button').click();
    }
  }

  // Batch lock
  injectScript(chrome.runtime.getURL('batchLockInject.bundle.js'));
  injectStylesheet(chrome.runtime.getURL('css/batchlock_inject.css'));
  // Thread list avatars
  injectStylesheet(chrome.runtime.getURL('css/thread_list_avatars.css'));
  // Auto refresh list
  injectStylesheet(chrome.runtime.getURL('css/autorefresh_list.css'));
});
