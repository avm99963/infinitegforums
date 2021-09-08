import {escapeUsername, getAuthUser} from '../../common/communityConsoleUtils.js';
import {isOptionEnabled} from '../../common/optionsUtils.js';

import {createExtBadge, getNParent} from './utils/common.js';

var authuser = getAuthUser();

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

export function injectPreviousPostsLinks(nameElement) {
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

  let badge, badgeTooltip;
  [badge, badgeTooltip] = createExtBadge();
  container.appendChild(badge);

  var linkContainer = document.createElement('div');
  linkContainer.classList.add('TWPT-previous-posts--links');

  addProfileHistoryLink(linkContainer, 'forum', query1);
  addProfileHistoryLink(linkContainer, 'all', query2);

  container.appendChild(linkContainer);

  mainCardContent.appendChild(container);
  new MDCTooltip(badgeTooltip);
}

export function injectPreviousPostsLinksIfEnabled(nameElement) {
  isOptionEnabled('history').then(isEnabled => {
    if (isEnabled) injectPreviousPostsLinks(nameElement);
  });
}
