chrome.storage.sync.get(null, function(items) {
  if (items.history &&
      document.querySelector('.user-profile__user-links') === null) {
    var nameElement = document.querySelector('.user-profile__user-name');
    if (nameElement !== null) {
      var name = escapeUsername(nameElement.textContent);
      var filter = 'creator:"' + name + '" | replier:"' + name + '"';
      var url = document.location.pathname.split('/profile')[0] +
          '/threads?thread_filter=' + encodeURIComponent(filter);

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

      console.log(links);

      document.querySelector('.user-profile__user-details-container')
          .appendChild(links);
    }
  }
});
