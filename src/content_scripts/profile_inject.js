chrome.storage.sync.get(null, function(items) {
  if (items.history &&
      document.querySelector('.user-profile__user-links') === null) {
    var nameElement = document.querySelector('.user-profile__user-name');
    if (nameElement !== null) {
      var name = escapeUsername(nameElement.innerHTML);
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
      a.classList.add('user-profile__user-link');
      a.href = url;
      a.setAttribute(
          'data-stats-id', 'user-posts-link--tw-power-tools-by-avm99963');
      a.textContent = chrome.i18n.getMessage('inject_previousposts');

      li.appendChild(a);
      ul.appendChild(li);
      links.appendChild(ul);

      console.log(links);

      document.querySelector('.user-profile__user-details-container')
          .appendChild(links);
    }
  }
});
