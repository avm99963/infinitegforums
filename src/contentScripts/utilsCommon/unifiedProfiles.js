import {MDCTooltip} from '@material/tooltip';

import {escapeUsername} from '../../common/communityConsoleUtils.js';
import {isOptionEnabled} from '../../common/optionsUtils.js';
import {createPlainTooltip} from '../../common/tooltip.js';
import {createExtBadge} from '../communityConsole/utils/common.js';

var authuser = (new URL(location.href)).searchParams.get('authuser') || '0';

export function getSearchUrl(query) {
  var urlpart = encodeURIComponent('query=' + encodeURIComponent(query));
  var authuserpart =
      (authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser));
  return 'https://support.google.com/s/community/search/' + urlpart +
      authuserpart;
}

export function injectPreviousPostsLinksUnifiedProfile(isCommunityConsole) {
  var nameElement =
      document.querySelector('.scTailwindUser_profileUsercardname');
  if (nameElement === null) {
    console.error('[previousposts] Can\'t find username.');
    return;
  }

  var name = escapeUsername(nameElement.textContent);
  var filter = '(creator:"' + name + '" | replier:"' + name + '") forum:any';
  var url = getSearchUrl(filter);

  var links = document.createElement('div');
  links.classList.add('TWPT-user-profile__user-links');

  var a = document.createElement('a');
  a.classList.add('TWPT-user-profile__user-link', 'TWPT-user-link');
  a.href = url;
  a.target = '_parent';
  a.setAttribute(
      'data-stats-id', 'user-posts-link--tw-power-tools-by-avm99963');

  let badge, badgeTooltip;
  if (isCommunityConsole) {
    [badge, badgeTooltip] = createExtBadge();
  } else {
    badge = document.createElement('span');
    badge.classList.add('TWPT-badge');

    var badgeImg = document.createElement('img');
    badgeImg.src =
        'https://fonts.gstatic.com/s/i/materialicons/repeat/v6/24px.svg';

    badge.appendChild(badgeImg);
  }

  a.appendChild(badge);

  var span = document.createElement('span');
  span.textContent = chrome.i18n.getMessage('inject_previousposts');

  a.appendChild(span);
  links.appendChild(a);

  var userDetailsNode =
      document.querySelector('.scTailwindUser_profileUsercarddetails');
  if (userDetailsNode === null) {
    console.error('[previousposts] Can\'t get user card details div.');
    return;
  }

  userDetailsNode.parentNode.insertBefore(links, userDetailsNode.nextSibling);

  if (isCommunityConsole)
    new MDCTooltip(badgeTooltip);
  else
    createPlainTooltip(
        badge, chrome.i18n.getMessage('inject_extension_badge_helper', [
          chrome.i18n.getMessage('appName')
        ]));
}

export function injectPreviousPostsLinksUnifiedProfileIfEnabled(
    isCommunityConsole) {
  isOptionEnabled('history').then(isEnabled => {
    if (isEnabled) injectPreviousPostsLinksUnifiedProfile(isCommunityConsole);
  });
}
