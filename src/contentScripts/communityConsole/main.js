import {injectScript, injectStyles, injectStylesheet} from '../../common/contentScriptsUtils';
import {getOptions} from '../../common/options/optionsUtils.js';
import XHRProxyKillSwitchHandler from '../../xhrInterceptor/killSwitchHandler.js';
import {injectPreviousPostsLinksUnifiedProfileIfEnabled} from '../utilsCommon/unifiedProfiles.js';

import AvatarsHandler from './avatars.js';
import {batchLock} from './batchLock.js';
// #!if ['chromium', 'chromium_mv3'].includes(browser_target)
import {applyDragAndDropFixIfEnabled} from './dragAndDropFix.js';
// #!endif
import {default as FlattenThreads, kMatchingSelectors as kFlattenThreadMatchingSelectors} from './flattenThreads/flattenThreads.js';
import {kRepliesSectionSelector} from './threadToolbar/constants.js';
import ThreadToolbar from './threadToolbar/threadToolbar.js';

var mutationObserver, options, avatars, threadToolbar, flattenThreads;

const watchedNodesSelectors = [
  // Scrollable content (used for the intersection observer)
  '.scrollable-content',

  // Load more bar and buttons
  '.load-more-bar',
  '.scTailwindThreadMorebuttonbutton',
  '.scTailwindThreadMessagegapbutton',

  // User profile card inside ec-unified-user
  'ec-unified-user .scTailwindUser_profileUsercardmain',

  // Username span/editor inside ec-unified-user (user profile view)
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

  // Thread page main content
  'ec-thread > .page > .material-content > div[role="list"]',

  // Thread page reply section (for the thread page toolbar)
  kRepliesSectionSelector,

  // Reply payload (for the flatten threads UI)
  ...kFlattenThreadMatchingSelectors,
];

function handleCandidateNode(node) {
  if (typeof node.classList !== 'undefined') {
    // Show the "previous posts" links if the option is currently enabled.
    //   Here we're selecting the 'ec-user > div' element (unique child)
    if (node.matches(
            'ec-unified-user .scTailwindUser_profileUsercarddetails')) {
      injectPreviousPostsLinksUnifiedProfileIfEnabled(
          /* isCommunityConsole = */ true);
    }

    // #!if ['chromium', 'chromium_mv3'].includes(browser_target)
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
    // #!endif

    // Inject the batch lock button in the thread list if the option is
    // currently enabled.
    if (batchLock.shouldAddButton(node)) {
      batchLock.addButtonIfEnabled(node);
    }

    // Inject avatar links to threads in the thread list. injectIfEnabled is
    // responsible of determining whether it should run or not depending on its
    // current setting.
    if (('tagName' in node) && (node.tagName == 'LI') &&
        node.querySelector('ec-thread-summary') !== null) {
      avatars.injectIfEnabled(node);
    }

    // Inject old thread page design warning if applicable
    if (node.matches(
            'ec-thread > .page > .material-content > div[role="list"]')) {
      window.TWPTThreadPageDesignWarning.injectWarningIfApplicable(node);
    }

    // Inject thread toolbar
    if (threadToolbar.shouldInject(node)) {
      threadToolbar.injectIfApplicable(node);
    }

    // Inject parent reply quote
    if (flattenThreads.shouldInjectQuote(node)) {
      flattenThreads.injectQuoteIfApplicable(node);
    }

    // Inject reply button in non-nested view
    if (flattenThreads.shouldInjectReplyBtn(node)) {
      flattenThreads.injectReplyBtnIfApplicable(node);
    }

    // Delete additional info in the edit message box
    if (flattenThreads.isAdditionalInfoElement(node)) {
      flattenThreads.deleteAdditionalInfoElementIfApplicable(node);
    }
  }
}

function handleRemovedNode(mutation, node) {
  if (!('tagName' in node)) return;

  // Readd reply button when the Community Console removes it
  if (node.tagName == 'TWPT-FLATTEN-THREAD-REPLY-BUTTON') {
    flattenThreads.injectReplyBtn(
        mutation.target, JSON.parse(node.getAttribute('extraInfo')));
  }
}

function mutationCallback(mutationList) {
  mutationList.forEach((mutation) => {
    if (mutation.type == 'childList') {
      mutation.addedNodes.forEach(function(node) {
        handleCandidateNode(node);
      });

      mutation.removedNodes.forEach(function(node) {
        handleRemovedNode(mutation, node);
      });
    }
  });
}

var observerOptions = {
  childList: true,
  subtree: true,
};

getOptions(null).then(items => {
  options = items;

  // Initialize classes needed by the mutation observer
  avatars = new AvatarsHandler();
  threadToolbar = new ThreadToolbar();
  flattenThreads = new FlattenThreads();

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
  // Thread toolbar
  injectStylesheet(chrome.runtime.getURL('css/thread_toolbar.css'));
  // Flatten threads
  injectStylesheet(chrome.runtime.getURL('css/flatten_threads.css'));
});

new XHRProxyKillSwitchHandler();
