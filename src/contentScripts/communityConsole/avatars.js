import {waitFor} from 'poll-until-promise';

import {CCApi} from '../../common/api.js';
import {parseUrl} from '../../common/commonUtils.js';

import AvatarsDB from './utils/AvatarsDB.js'

export default class AvatarsHandler {
  constructor() {
    this.isFilterSetUp = false;
    this.privateForums = [];
    this.db = new AvatarsDB();
  }

  // Gets a list of private forums. If it is already cached, the cached list is
  // returned; otherwise it is also computed and cached.
  getPrivateForums() {
    return new Promise((resolve, reject) => {
      if (this.isFilterSetUp) return resolve(this.privateForums);

      if (!document.documentElement.hasAttribute('data-startup'))
        return reject('[threadListAvatars] Couldn\'t get startup data.');

      var startupData =
          JSON.parse(document.documentElement.getAttribute('data-startup'));
      var forums = startupData?.['1']?.['2'];
      if (forums === undefined)
        return reject(
            '[threadListAvatars] Couldn\'t retrieve forums from startup data.');

      for (var f of forums) {
        var forumId = f?.['2']?.['1']?.['1'];
        var forumVisibility = f?.['2']?.['18'];
        if (forumId === undefined || forumVisibility === undefined) {
          console.warn(
              '[threadListAvatars] Coudln\'t retrieve forum id and/or forum visibility for the following forum:',
              f);
          continue;
        }

        // forumVisibility's value 1 means "PUBLIC".
        if (forumVisibility != 1) this.privateForums.push(forumId);
      }

      // Forum 51488989 is marked as public but it is in fact private.
      this.privateForums.push('51488989');

      this.isFilterSetUp = true;
      return resolve(this.privateForums);
    });
  }

  // Some threads belong to private forums, and this feature will not be able to
  // get its avatars since it makes an anonymomus call to get the contents of
  // the thread.
  //
  // This function returns whether avatars should be retrieved depending on if
  // the thread belongs to a known private forum.
  shouldRetrieveAvatars(thread) {
    return this.getPrivateForums().then(privateForums => {
      if (privateForums.includes(thread.forum)) return false;

      return this.db.isForumUnauthorized(thread.forum).then(res => !res);
    });
  }

  // Get an object with the author of the thread, an array of the first |num|
  // replies from the thread |thread|, and additional information about the
  // thread.
  getFirstMessages(thread, num = 15) {
    return CCApi(
               'ViewThread', {
                 1: thread.forum,
                 2: thread.thread,
                 // options
                 3: {
                   // pagination
                   1: {
                     2: num,  // maxNum
                   },
                   3: true,    // withMessages
                   5: true,    // withUserProfile
                   10: false,  // withPromotedMessages
                   16: false,  // withThreadNotes
                   18: true,   // sendNewThreadIfMoved
                 }
               },
               // |authentication| is false because otherwise this would mark
               // the thread as read as a side effect, and that would mark all
               // threads in the list as read.
               //
               // Due to the fact that we have to call this endpoint
               // anonymously, this means we can't retrieve information about
               // threads in private forums.
               /* authentication = */ false, /* authuser = */ 0,
               /* returnUnauthorizedStatus = */ true)
        .then(response => {
          if (response.unauthorized)
            return this.db.putUnauthorizedForum(thread.forum).then(() => {
              throw new Error('Permission denied to load thread.');
            });

          var data = response.body;

          var numMessages = data?.['1']?.['8'];
          if (numMessages === undefined)
            throw new Error(
                'Request to view thread doesn\'t include the number of messages');

          var messages = numMessages == 0 ? [] : data?.['1']['3'];
          if (messages === undefined)
            throw new Error(
                'numMessages was ' + numMessages +
                ' but the response didn\'t include any message.');

          var author = data?.['1']?.['4'];
          if (author === undefined)
            throw new Error(
                'Author isn\'t included in the ViewThread response.');

          return {
            messages,
            author,

            // The following fields are useful for the cache and can be
            // undefined, but this is checked before adding an entry to the
            // cache.
            updatedTimestamp: data?.['1']?.['2']?.['1']?.['4'],
            lastMessageId: data?.['1']?.['2']?.['10'],
          };
        });
  }

  // Get a list of at most |num| avatars for thread |thread| by calling the API
  getVisibleAvatarsFromServer(thread, num) {
    return this.getFirstMessages(thread).then(result => {
      var messages = result.messages;
      var author = result.author;
      var updatedTimestamp =
          Math.floor(Number.parseInt(result.updatedTimestamp) / 1000000);
      var lastMessageId = result.lastMessageId;

      var avatarUrls = [];

      var authorUrl = author?.['1']?.['2'];
      if (authorUrl !== undefined) avatarUrls.push(authorUrl);

      for (var m of messages) {
        var url = m?.['3']?.['1']?.['2'];

        if (url === undefined) continue;
        if (!avatarUrls.includes(url)) avatarUrls.push(url);
        if (avatarUrls.length == 3) break;
      }

      // Add entry to cache if all the extra metadata could be retrieved.
      if (updatedTimestamp !== undefined && lastMessageId !== undefined)
        this.db.putCacheEntry({
          threadId: thread.thread,
          updatedTimestamp,
          lastMessageId,
          avatarUrls,
          num,
          lastUsedTimestamp: Math.floor(Date.now() / 1000),
        });

      return avatarUrls;
    });
  }

  // Returns an object with a cache entry that matches the request if found (via
  // the |entry| property). The property |found| indicates whether the cache
  // entry was found.
  getVisibleAvatarsFromCache(thread, num) {
    return waitFor(
        () => this.db.getCacheEntry(thread.thread).then(entry => {
          if (entry === undefined || entry.num < num)
            return {
              found: false,
            };

          // Only use cache entry if lastUsedTimestamp is within the last 30
          // seconds (which means it has been checked for invalidations):
          var now = Math.floor(Date.now() / 1000);
          var diff = now - entry.lastUsedTimestamp;
          if (diff > 30)
            throw new Error(
                'lastUsedTimestamp isn\'t within the last 30 seconds (the difference is:',
                diff, ').');
          return {
            found: true,
            entry,
          };
        }),
        {
          interval: 400,
          timeout: 10 * 1000,
        });
  }

  // Get a list of at most |num| avatars for thread |thread|
  getVisibleAvatars(thread, num = 3) {
    return this.shouldRetrieveAvatars(thread).then(shouldRetrieve => {
      if (!shouldRetrieve) {
        console.debug('[threadListAvatars] Skipping thread', thread);
        return [];
      }

      return this.getVisibleAvatarsFromCache(thread, num)
          .then(res => {
            if (res.found) return res.entry.avatarUrls;

            return this.getVisibleAvatarsFromServer(thread, num);
          })
          .catch(err => {
            console.error(
                '[threadListAvatars] Error while retrieving avatars:', err);
            return this.getVisibleAvatarsFromServer(thread, num);
          });
    });
  }

  // Inject avatars for thread summary (thread item) |node| in a thread list.
  inject(node) {
    var header = node.querySelector(
        'ec-thread-summary .main-header .panel-description a.header');
    if (header === null) {
      console.error(
          '[threadListAvatars] Header is not present in the thread item\'s DOM.');
      return;
    }

    var thread = parseUrl(header.href);
    if (thread === false) {
      console.error('[threadListAvatars] Thread\'s link cannot be parsed.');
      return;
    }

    this.getVisibleAvatars(thread)
        .then(avatarUrls => {
          var avatarsContainer = document.createElement('div');
          avatarsContainer.classList.add('TWPT-avatars');

          var count = Math.floor(Math.random() * 4);

          for (var i = 0; i < avatarUrls.length; ++i) {
            var avatar = document.createElement('div');
            avatar.classList.add('TWPT-avatar');
            avatar.style.backgroundImage = 'url(\'' + avatarUrls[i] + '\')';
            avatarsContainer.appendChild(avatar);
          }

          header.appendChild(avatarsContainer);
        })
        .catch(err => {
          console.error(
              '[threadListAvatars] Could not retrieve avatars for thread',
              thread, err);
        });
  }
};
