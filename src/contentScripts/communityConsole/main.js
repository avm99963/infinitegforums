import {injectStylesheet} from '../../common/contentScriptsUtils';
import {getOptions} from '../../common/options/optionsUtils.js';
import XHRProxyKillSwitchHandler from '../../xhrInterceptor/killSwitchHandler.js';
import {injectPreviousPostsLinksUnifiedProfileIfEnabled} from '../utilsCommon/unifiedProfiles.js';

import AvatarsHandler from './avatars.js';

var mutationObserver, options, avatars;

const watchedNodesSelectors = [
  // Username span/editor inside ec-unified-user (user profile view)
  'ec-unified-user .scTailwindUser_profileUsercarddetails',

  // Thread list items (used to inject the avatars)
  'li',
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

    // Inject avatar links to threads in the thread list. injectIfEnabled is
    // responsible of determining whether it should run or not depending on its
    // current setting.
    if (('tagName' in node) && (node.tagName == 'LI') &&
        node.querySelector('ec-thread-summary') !== null) {
      avatars.injectIfEnabled(node);
    }
  }
}

function mutationCallback(mutationList) {
  mutationList.forEach((mutation) => {
    if (mutation.type == 'childList') {
      mutation.addedNodes.forEach(function(node) {
        handleCandidateNode(node);
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

  // Before starting the mutation Observer, check whether we missed any
  // mutations by manually checking whether some watched nodes already
  // exist.
  var cssSelectors = watchedNodesSelectors.join(',');
  document.querySelectorAll(cssSelectors)
      .forEach(node => handleCandidateNode(node));

  mutationObserver = new MutationObserver(mutationCallback);
  mutationObserver.observe(document.body, observerOptions);

  // Thread list avatars
  injectStylesheet(chrome.runtime.getURL('css/thread_list_avatars.css'));
  // Thread toolbar
  injectStylesheet(chrome.runtime.getURL('css/thread_toolbar.css'));
});

new XHRProxyKillSwitchHandler();
