/**
 * Code used in the main world of the Community Console and TW basic threads to
 * inject and load the data for the profile indicator.
 */

import {CCApi} from '@/common/api.js';
import {createImmuneLink} from '@/common/commonUtils.js';
import {escapeUsername} from '@/common/communityConsoleUtils.js';
import {createPlainTooltip} from '@/common/tooltip.js';

const OP_FIRST_POST = 0;
const OP_OTHER_POSTS_READ = 1;
const OP_OTHER_POSTS_UNREAD = 2;

const OPClasses = {
  0: 'first-post',
  1: 'other-posts-read',
  2: 'other-posts-unread',
};

const OPi18n = {
  0: 'first_post',
  1: 'other_posts_read',
  2: 'other_posts_unread',
};

export const UI_COMMUNITY_CONSOLE = 0;
export const UI_TW_LEGACY = 1;
export const UI_TW_INTEROP = 2;
export const UI_COMMUNITY_CONSOLE_INTEROP = 3;
export const UI_TW_INTEROP_V2 = 4;
export const UI_COMMUNITY_CONSOLE_INTEROP_V2 = 5;

// Filter used as a workaround to speed up the ViewForum request.
const FILTER_ALL_LANGUAGES =
    'lang:(ar | bg | ca | "zh-hk" | "zh-cn" | "zh-tw" | hr | cs | da | nl | en | "en-au" | "en-gb" | et | fil | fi | fr | de | el | iw | hi | hu | id | it | ja | ko | lv | lt | ms | no | pl | "pt-br" | "pt-pt" | ro | ru | sr | sk | sl | es | "es-419" | sv | th | tr | uk | vi)';

const numPostsForumArraysToSum = [3, 4];

function isCommunityConsole(ui) {
  return ui === UI_COMMUNITY_CONSOLE || ui === UI_COMMUNITY_CONSOLE_INTEROP ||
      ui === UI_COMMUNITY_CONSOLE_INTEROP_V2;
}

function isInteropV1(ui) {
  return ui === UI_TW_INTEROP || ui === UI_COMMUNITY_CONSOLE_INTEROP;
}

function isInteropV2(ui) {
  return ui === UI_TW_INTEROP_V2 || ui === UI_COMMUNITY_CONSOLE_INTEROP_V2;
}

function getPosts(query, forumId, authuser) {
  return CCApi(
      'ViewForum', {
        '1': forumId,
        '2': {
          '1': {
            '2': 5,
          },
          '2': {
            '1': 1,
            '2': true,
          },
          '12': query,
        },
      },
      /* authenticated = */ true, authuser);
}

function getProfile(userId, forumId, authuser) {
  return CCApi(
      'ViewUser', {
        '1': userId,
        '2': 0,
        '3': forumId,
        '4': {
          '20': true,
        },
      },
      /* authenticated = */ true, authuser);
}

// Source:
// https://stackoverflow.com/questions/33063774/communication-from-an-injected-script-to-the-content-script-with-a-response
var contentScriptRequest = (function() {
  var requestId = 0;
  var prefix = 'TWPT-profileindicator';

  function sendRequest(data) {
    var id = requestId++;

    return new Promise(function(resolve) {
      var listener = function(evt) {
        if (evt.source === window && evt.data && evt.data.prefix === prefix &&
            evt.data.requestId == id) {
          // Deregister self
          window.removeEventListener('message', listener);
          resolve(evt.data.data);
        }
      };

      window.addEventListener('message', listener);

      var payload = {data, id, prefix};

      window.dispatchEvent(
          new CustomEvent('TWPT_sendRequest', {detail: payload}));
    });
  }

  return {sendRequest: sendRequest};
})();

// Inject the indicator dot/badge to the appropriate position.
function injectIndicator(sourceNode, indicatorEl, ui) {
  if (!isInteropV2(ui)) {
    sourceNode.parentNode.appendChild(indicatorEl);
    return;
  }

  let username =
      sourceNode.querySelector('.scTailwindThreadPost_headerUserinfoname');
  username.append(indicatorEl);
}

// Create profile indicator dot with a loading state, or return the numPosts
// badge if it is already created.
function createIndicatorDot(sourceNode, searchURL, options, ui) {
  if (options.numPosts) return document.querySelector('.num-posts-indicator');
  var dotContainer = document.createElement('div');
  dotContainer.classList.add('profile-indicator', 'profile-indicator--loading');

  var dotLink = (isCommunityConsole(ui)) ? createImmuneLink() :
                                           document.createElement('a');
  dotLink.classList.add(
      'profile-indicator-link', 'profile-indicator-link--dot');
  dotLink.href = searchURL;
  dotLink.innerText = '●';

  dotContainer.appendChild(dotLink);
  injectIndicator(sourceNode, dotContainer, ui);

  contentScriptRequest
      .sendRequest({
        'action': 'geti18nMessage',
        'msg': 'inject_profileindicator_loading'
      })
      .then(string => createPlainTooltip(dotContainer, string));

  return dotContainer;
}

// Create badge indicating the number of posts with a loading state
function createNumPostsBadge(sourceNode, searchURL, ui) {
  var link = (isCommunityConsole(ui)) ? createImmuneLink() :
                                        document.createElement('a');
  link.classList.add(
      'profile-indicator-link', 'profile-indicator-link--num-posts');
  link.href = searchURL;

  var numPostsContainer = document.createElement('div');
  numPostsContainer.classList.add(
      'num-posts-indicator', 'num-posts-indicator--loading');

  var numPostsSpan = document.createElement('span');
  numPostsSpan.classList.add('num-posts-indicator--num');

  numPostsContainer.appendChild(numPostsSpan);
  link.appendChild(numPostsContainer);
  injectIndicator(sourceNode, link, ui);

  contentScriptRequest
      .sendRequest({
        'action': 'geti18nMessage',
        'msg': 'inject_profileindicator_loading'
      })
      .then(string => createPlainTooltip(numPostsContainer, string));

  return numPostsContainer;
}

// Set the badge text
function setNumPostsBadge(badge, text) {
  badge.classList.remove('num-posts-indicator--loading');
  badge.querySelector('span').classList.remove(
      'num-posts-indicator--num--loading');
  badge.querySelector('span').textContent = text;
}

// Get options and then handle all the indicators
export function getOptionsAndHandleIndicators(sourceNode, ui, authuser) {
  contentScriptRequest.sendRequest({'action': 'getProfileIndicatorOptions'})
      .then(options => handleIndicators(sourceNode, ui, options, authuser));
}

// Handle the profile indicator dot
function handleIndicators(sourceNode, ui, options, authuser) {
  let nameEl;
  if (ui === UI_COMMUNITY_CONSOLE)
    nameEl = sourceNode.querySelector('.name-text');
  if (ui === UI_TW_LEGACY) nameEl = sourceNode.querySelector('span');
  if (isInteropV1(ui)) nameEl = sourceNode;
  if (isInteropV2(ui))
    nameEl =
        sourceNode.querySelector('.scTailwindThreadPost_headerUserinfoname');
  var escapedUsername = escapeUsername(nameEl.textContent);

  var threadLink;
  if (isCommunityConsole(ui)) {
    threadLink = document.location.href;
  } else {
    var CCLink = document.getElementById('onebar-community-console');
    if (CCLink === null) {
      console.error(
          '[opindicator] The user is not a PE so the dot indicator cannot be shown in TW.');
      return;
    }
    threadLink = CCLink.href;
  }

  var forumUrlSplit = threadLink.split('/forum/');
  if (forumUrlSplit.length < 2) {
    console.error('[opindicator] Can\'t get forum id.');
    return;
  }

  var forumId = forumUrlSplit[1].split('/')[0];

  var query = '(replier:"' + escapedUsername + '" | creator:"' +
      escapedUsername + '") ' + FILTER_ALL_LANGUAGES + ' forum:' + forumId;
  var encodedQuery = encodeURIComponent(query);
  var authuserPart =
      (authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser));
  var searchURL = 'https://support.google.com/s/community/search/' +
      encodeURIComponent('query=' + encodedQuery) + authuserPart;

  if (options.numPosts) {
    var profileURL = new URL(sourceNode.href);
    var userId = profileURL.pathname
                     .split(isCommunityConsole(ui) ? 'user/' : 'profile/')[1]
                     .split('?')[0]
                     .split('/')[0];

    var numPostsContainer = createNumPostsBadge(sourceNode, searchURL, ui);

    getProfile(userId, forumId, authuser)
        .then(res => {
          if (!('1' in res) || !('2' in res[1])) {
            throw new Error('Unexpected profile response.');
          }

          contentScriptRequest.sendRequest({'action': 'getNumPostMonths'})
              .then(months => {
                if (!options.indicatorDot)
                  contentScriptRequest
                      .sendRequest({
                        'action': 'geti18nMessage',
                        'msg': 'inject_profileindicatoralt_numposts',
                        'placeholders': [months]
                      })
                      .then(
                          string =>
                              createPlainTooltip(numPostsContainer, string));

                var numPosts = 0;

                for (const index of numPostsForumArraysToSum) {
                  if (!(index in res[1][2])) {
                    throw new Error('Unexpected profile response.');
                  }

                  var i = 0;
                  for (const month of res[1][2][index].reverse()) {
                    if (i == months) break;
                    numPosts += month[3] || 0;
                    ++i;
                  }
                }

                setNumPostsBadge(numPostsContainer, numPosts);
              })
              .catch(
                  err => console.error('[opindicator] Unexpected error.', err));
        })
        .catch(err => {
          console.error(
              '[opindicator] Unexpected error. Couldn\'t load profile.', err);
          setNumPostsBadge(numPostsContainer, '?');
        });
  }

  if (options.indicatorDot) {
    var dotContainer = createIndicatorDot(sourceNode, searchURL, options, ui);

    // Query threads in order to see what state the indicator should be in
    getPosts(query, forumId, authuser)
        .then(res => {
          // Throw an error when the replies array is not present in the reply.
          if (!('1' in res) || !('2' in res['1'])) {
            // Throw a different error when the numThreads field exists and is
            // equal to 0. This reply can be received, but is enexpected,
            // because we know that the user has replied in at least 1 thread
            // (the current one).
            if (('1' in res) && ('4' in res['1']) && res['1']['4'] == 0)
              throw new Error(
                  'Thread list is empty ' +
                  '(but the OP has participated in this thread, ' +
                  'so it shouldn\'t be empty).');

            throw new Error('Unexpected thread list response.');
          }

          // Current thread ID
          var threadUrlSplit = threadLink.split('/thread/');
          if (threadUrlSplit.length < 2)
            throw new Error('Can\'t get thread id.');

          var currId = threadUrlSplit[1].split('?')[0].split('/')[0];

          var OPStatus = OP_FIRST_POST;

          for (const thread of res['1']['2']) {
            var id = thread['2']['1']['1'] || undefined;
            if (id === undefined || id == currId) continue;

            var isRead = thread['6'] || false;
            if (isRead)
              OPStatus = Math.max(OP_OTHER_POSTS_READ, OPStatus);
            else
              OPStatus = Math.max(OP_OTHER_POSTS_UNREAD, OPStatus);
          }

          var dotContainerPrefix =
              (options.numPosts ? 'num-posts-indicator' : 'profile-indicator');

          if (!options.numPosts)
            dotContainer.classList.remove(dotContainerPrefix + '--loading');
          dotContainer.classList.add(
              dotContainerPrefix + '--' + OPClasses[OPStatus]);
          contentScriptRequest
              .sendRequest({
                'action': 'geti18nMessage',
                'msg': 'inject_profileindicator_' + OPi18n[OPStatus]
              })
              .then(string => createPlainTooltip(dotContainer, string));
        })
        .catch(
            err => console.error(
                '[opindicator] Unexpected error. Couldn\'t load recent posts.',
                err));
  }
}
