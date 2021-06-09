var authuser = (new URL(location.href)).searchParams.get('authuser') || '0';

function getSearchUrl(query) {
  var urlpart = encodeURIComponent('query=' + encodeURIComponent(query));
  var authuserpart =
      (authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser));
  return url = 'https://support.google.com/s/community/search/' + urlpart +
      authuserpart;
}

function injectPreviousPostsLinksUnifiedProfile() {
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
  a.setAttribute(
      'data-stats-id', 'user-posts-link--tw-power-tools-by-avm99963');

  var badge = document.createElement('span');
  badge.classList.add('TWPT-badge');
  badge.setAttribute(
      'title', chrome.i18n.getMessage('inject_extension_badge_helper', [
        chrome.i18n.getMessage('appName')
      ]));

  var badgeImg = document.createElement('img');
  badgeImg.src =
      'https://fonts.gstatic.com/s/i/materialicons/repeat/v6/24px.svg';

  badge.appendChild(badgeImg);
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
}

function injectPreviousPostsLinksOldProfile() {
  if (document.querySelector('.user-profile__user-links') === null) {
    var nameElement = document.querySelector('.user-profile__user-name');
    if (nameElement !== null) {
      var profileLink = document.querySelector('.community-console');
      if (profileLink === null) {
        console.error(
            '[previousposts] ' +
            'The user is not a PE so we can\'t show the previous posts link.');
        return;
      }

      var profileUrl = profileLink.href || '';
      var profileUrlSplit = profileUrl.split('/forum/');
      if (profileUrlSplit.length < 2) {
        console.error('[previousposts] Can\'t get forum id.');
        return;
      }

      var forumId = profileUrlSplit[1].split('/')[0];
      var name = escapeUsername(nameElement.textContent);
      var filter =
          '(creator:"' + name + '" | replier:"' + name + '") forum:' + forumId;
      var url = getSearchUrl(filter);

      var links = document.createElement('div');
      links.classList.add('user-profile__user-links');

      var linkTitle = document.createElement('div');
      linkTitle.classList.add('user-profile__user-link-title');
      linkTitle.textContent = chrome.i18n.getMessage('inject_links');

      links.appendChild(linkTitle);

      var ul = document.createElement('ul');

      var li = document.createElement('li');
      li.classList.add('user-profile__user-link');

      var a = document.createElement('a');
      a.classList.add('user-profile__user-link', 'TWPT-user-link');
      a.href = url;
      a.setAttribute(
          'data-stats-id', 'user-posts-link--tw-power-tools-by-avm99963');

      var badge = document.createElement('span');
      badge.classList.add('TWPT-badge');
      badge.setAttribute(
          'title', chrome.i18n.getMessage('inject_extension_badge_helper', [
            chrome.i18n.getMessage('appName')
          ]));

      var badgeImg = document.createElement('img');
      badgeImg.src =
          'https://fonts.gstatic.com/s/i/materialicons/repeat/v6/24px.svg';

      badge.appendChild(badgeImg);
      a.appendChild(badge);

      var span = document.createElement('span');
      span.textContent = chrome.i18n.getMessage('inject_previousposts');

      a.appendChild(span);
      li.appendChild(a);
      ul.appendChild(li);
      links.appendChild(ul);

      document.querySelector('.user-profile__user-details-container')
          .appendChild(links);
    } else {
      console.error('[previousposts] Can\'t find username.');
    }
  }
}

chrome.storage.sync.get(null, function(items) {
  if (items.history) {
    if (document.getElementById('unified-user-profile') !== null)
      injectPreviousPostsLinksUnifiedProfile();
    else
      injectPreviousPostsLinksOldProfile();
  }
});
