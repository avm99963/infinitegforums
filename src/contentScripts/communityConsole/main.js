import {injectScript, injectStyles, injectStylesheet} from '../../common/contentScriptsUtils.js';
import {getOptions} from '../../common/optionsUtils.js';
import {injectPreviousPostsLinksUnifiedProfileIfEnabled} from '../utilsCommon/unifiedProfiles.js';

import AvatarsHandler from './avatars.js';
import {batchLock} from './batchLock.js';
import {injectDarkModeButton, isDarkThemeOn} from './darkMode.js';
// #!if ['chromium', 'chromium_mv3'].includes(browser_target)
import {applyDragAndDropFixIfEnabled} from './dragAndDropFix.js';
// #!endif
import {default as FlattenThreads, kMatchingSelectors as kFlattenThreadMatchingSelectors} from './flattenThreads/flattenThreads.js';
import InfiniteScroll from './infiniteScroll.js';
import {kRepliesSectionSelector} from './threadToolbar/constants.js';
import ThreadToolbar from './threadToolbar/threadToolbar.js';
import {unifiedProfilesFix} from './unifiedProfiles.js';
import Workflows from './workflows/workflows.js';

var mutationObserver, options, avatars, infiniteScroll, workflows,
    threadToolbar, flattenThreads;

const watchedNodesSelectors = [
  // App container (used to set up the intersection observer and inject the dark
  // mode button)
  'ec-app',

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

  // Thread list items (used to inject the avatars and extra info)
  'li',

  // Thread list item toolbelt (used for the extra info feature)
  'ec-thread-summary .main .toolbelt',

  // Thread list (used for the autorefresh feature)
  'ec-thread-list',

  // Unified profile iframe
  'iframe',

  // Canned response tags or toolbelt (for the extra info feature and the
  // "import CR" popup for the workflows feature)
  'ec-canned-response-row .tags',
  'ec-canned-response-row .main .toolbelt',

  // Question state chips container (for the extra info feature)
  'ec-question .state-chips',

  // Replies (for the extra info feature)
  'ec-thread ec-message',

  // User activity chart (for the per-forum stats feature)
  'ec-unified-user .scTailwindUser_profileUserprofilesection ' +
      'sc-tailwind-shared-activity-chart',

  // Thread page main content
  'ec-thread > .page > .material-content > div[role="list"]',

  // Thread page reply section (for the thread page toolbar)
  kRepliesSectionSelector,

  // Reply payload (for the flatten threads UI)
  ...kFlattenThreadMatchingSelectors,
];

function handleCandidateNode(node) {
  if (typeof node.classList !== 'undefined') {
    if (('tagName' in node) && node.tagName == 'EC-APP') {
      infiniteScroll.setUpIntersectionObserver(node, false);

      // Inject the dark mode button
      // TODO(avm99963): make this feature dynamic.
      if (options.ccdarktheme && options.ccdarktheme_mode == 'switch') {
        var rightControl = node.querySelector('header .right-control');
        if (rightControl !== null)
          injectDarkModeButton(rightControl, options.ccdarktheme_switch_status);
      }
    }

    // To set up infinite scroll
    if (node.classList.contains('scrollable-content')) {
      infiniteScroll.setUpIntersectionObserver(node, true);
    }

    // Start the intersectionObserver for the "load more"/"load all" buttons
    // inside a thread if the option is currently enabled.
    if (node.classList.contains('load-more-bar')) {
      infiniteScroll.observeLoadMoreBar(node);
    }
    if (node.classList.contains('scTailwindThreadMorebuttonbutton') ||
        node.classList.contains('scTailwindThreadMessagegapbutton')) {
      infiniteScroll.observeLoadMoreInteropBtn(node);
    }

    // Show additional details in the profile view.
    if (node.matches('ec-unified-user .scTailwindUser_profileUsercardmain')) {
      window.TWPTExtraInfo.injectAtProfileIfEnabled(node);
    }

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

    // Inject the worflows menu in the thread list if the option is currently
    // enabled.
    if (workflows.shouldAddThreadListBtn(node)) {
      workflows.addThreadListBtnIfEnabled(node);
    }

    // Inject the batch lock button in the thread list if the option is
    // currently enabled.
    if (batchLock.shouldAddButton(node)) {
      batchLock.addButtonIfEnabled(node);
    }

    // Inject avatar links to threads in the thread list. injectIfEnabled is
    // responsible of determining whether it should run or not depending on its
    // current setting.
    //
    // Also, inject extra info in the thread list.
    if (('tagName' in node) && (node.tagName == 'LI') &&
        node.querySelector('ec-thread-summary') !== null) {
      avatars.injectIfEnabled(node);
      window.TWPTExtraInfo.injectAtThreadListIfEnabled(node);
    }

    // Inject extra info in the toolbelt of an expanded thread list item.
    if (node.matches('ec-thread-summary .main .toolbelt')) {
      window.TWPTExtraInfo.injectAtExpandedThreadListIfEnabled(node);
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

    // Show additional details in the canned responses view (and add the
    // "import" button if applicable for the workflows feature).
    if (node.matches('ec-canned-response-row .tags')) {
      window.TWPTExtraInfo.injectAtCRIfEnabled(node, /* isExpanded = */ false);
      window.TWPTWorkflowsImport.addButtonIfEnabled(node);
    }
    if (node.matches('ec-canned-response-row .main .toolbelt')) {
      const tags = node.parentNode?.querySelector?.('.tags');
      if (tags)
        window.TWPTExtraInfo.injectAtCRIfEnabled(tags, /* isExpanded = */ true);
    }

    // Show additional details in the thread view.
    if (node.matches('ec-question .state-chips')) {
      window.TWPTExtraInfo.injectAtQuestionIfEnabled(node);
    }
    if (node.matches('ec-thread ec-message')) {
      window.TWPTExtraInfo.injectAtMessageIfEnabled(node);
    }

    // Inject per-forum stats section in the user profile
    if (node.matches(
            'ec-unified-user .scTailwindUser_profileUserprofilesection ' +
            'sc-tailwind-shared-activity-chart')) {
      window.TWPTExtraInfo.injectPerForumStatsIfEnabled(node);
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

  // Remove snackbar when exiting thread list view
  if (node.tagName == 'EC-THREAD-LIST') {
    window.TWPTAutoRefresh.hideUpdatePrompt();
  }

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
  infiniteScroll = new InfiniteScroll();
  workflows = new Workflows();
  threadToolbar = new ThreadToolbar();
  flattenThreads = new FlattenThreads();

  // autoRefresh, extraInfo, threadPageDesignWarning and workflowsImport are
  // initialized in start.js

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
  // Extra info
  injectStylesheet(chrome.runtime.getURL('css/extrainfo.css'));
  injectStylesheet(chrome.runtime.getURL('css/extrainfo_perforumstats.css'));
  // Workflows, Thread toolbar
  injectScript(chrome.runtime.getURL('litComponentsInject.bundle.js'));
  // Thread toolbar
  injectStylesheet(chrome.runtime.getURL('css/thread_toolbar.css'));
  // Flatten threads
  injectStylesheet(chrome.runtime.getURL('css/flatten_threads.css'));
});
