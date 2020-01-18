chrome.storage.sync.get(null, function(items) {
  if (items.history && document.querySelector(".user-profile__user-links") === null) {
    var nameElement = document.querySelector(".user-profile__user-name");
    if (nameElement !== null) {
      var name = encodeURIComponent(nameElement.innerText);
      var link = document.location.pathname.split("/profile")[0]+"/threads?thread_filter=(creator:%22"+name+"%22+%7C+replier:%22"+name+"%22)";
      document.querySelector(".user-profile__user-details-container").insertAdjacentHTML('beforeend', '<div class="user-profile__user-links"><div class="user-profile__user-link-title">'+chrome.i18n.getMessage("inject_links")+'</div><ul><li class="user-profile__user-link"><a href="'+link+'" data-stats-id="my-posts-link">'+chrome.i18n.getMessage("inject_previousposts")+'</a></li></ul></div>');
    }
  }
});
