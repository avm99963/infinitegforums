import {openDB} from 'idb';

const dbName = 'TWPTAvatarsDB';
const threadListRequestEvent = 'TWPT_ViewForumRequest';
const threadListLoadEvent = 'TWPT_ViewForumResponse';
const createMessageLoadEvent = 'TWPT_CreateMessageRequest';
// Time after the last use when a cache entry should be deleted (in s):
const cacheExpirationTime = 4 * 24 * 60 * 60;  // 4 days
// Probability of running the piece of code to remove unused cache entries after
// loading the thread list.
const probRemoveUnusedCacheEntries = 0.10;  // 10%

// Time after which an unauthorized forum entry expires (in s).
const unauthorizedForumExpirationTime = 1 * 24 * 60 * 60;  // 1 day

export default class AvatarsDB {
  constructor() {
    this.dbPromise = undefined;
    this.openDB();
    this.setUpInvalidationsHandlers();
  }

  openDB() {
    if (this.dbPromise === undefined)
      this.dbPromise = openDB(dbName, 1, {
        upgrade: (udb, oldVersion, newVersion, transaction) => {
          switch (oldVersion) {
            case 0:
              var cache = udb.createObjectStore('avatarsCache', {
                keyPath: 'threadId',
              });
              cache.createIndex(
                  'lastUsedTimestamp', 'lastUsedTimestamp', {unique: false});

              var unauthedForums = udb.createObjectStore('unauthorizedForums', {
                keyPath: 'forumId',
              });
              unauthedForums.createIndex(
                  'expirationTimestamp', 'expirationTimestamp',
                  {unique: false});
          }
        },
      });
  }

  // avatarsCache methods:
  getCacheEntry(threadId) {
    return this.dbPromise.then(db => db.get('avatarsCache', threadId));
  }

  putCacheEntry(entry) {
    return this.dbPromise.then(db => db.put('avatarsCache', entry));
  }

  invalidateCacheEntryIfExists(threadId) {
    return this.dbPromise.then(db => db.delete('avatarsCache', threadId));
  }

  removeUnusedCacheEntries() {
    console.debug('[threadListAvatars] Removing unused cache entries...');
    return this.dbPromise
        .then(db => {
          var upperBoundTimestamp =
              Math.floor(Date.now() / 1000) - cacheExpirationTime;
          var range = IDBKeyRange.upperBound(upperBoundTimestamp);

          var tx = db.transaction('avatarsCache', 'readwrite');
          var index = tx.store.index('lastUsedTimestamp');
          return index.openCursor(range);
        })
        .then(function iterateCursor(cursor) {
          if (!cursor) return;
          cursor.delete();
          return cursor.continue().then(iterateCursor);
        });
  }

  setUpInvalidationsHandlers() {
    let ignoredRequests = [];

    window.addEventListener(threadListRequestEvent, e => {
      // Ignore ViewForum requests made by the chat feature and the "Mark as
      // duplicate" dialog.
      //
      // All those requests have |maxNum| set to 10 and 20 respectively, while
      // the requests that we want to handle are the ones to initially load the
      // thread list (which currently requests 100 threads) and the ones to load
      // more threads (which request 50 threads).
      var maxNum = e.detail.body?.['2']?.['1']?.['2'];
      if (maxNum == 10 || maxNum == 20) ignoredRequests.push(e.$TWPTID);
    });
    window.addEventListener(threadListLoadEvent, e => {
      if (ignoredRequests.includes(e.$TWPTID)) {
        ignoredRequests = ignoredRequests.filter(item => item != e.$TWPTID);
        return;
      }

      this.handleInvalidationsByListLoad(e);
    });
    window.addEventListener(
        createMessageLoadEvent, e => this.handleInvalidationByNewMessage(e));
  }

  handleInvalidationsByListLoad(e) {
    var response = e?.detail?.body;
    var threads = response?.['1']?.['2'];
    if (threads === undefined) {
      console.warn(
          '[threadListAvatars] The thread list doesn\'t contain any threads.');
      return;
    }

    var promises = [];
    threads.forEach(t => {
      var id = t?.['2']?.['1']?.['1'];
      var currentLastMessageId = t?.['2']?.['10'];

      if (id === undefined) return;

      promises.push(this.getCacheEntry(id).then(entry => {
        if (entry === undefined) return;

        // If the cache entry is still valid.
        if (currentLastMessageId !== undefined &&
            currentLastMessageId == entry.lastMessageId) {
          entry.lastUsedTimestamp = Math.floor(Date.now() / 1000);
          return this.putCacheEntry(entry).catch(err => {
            console.error(
                '[threadListAvatars] Error while updating lastUsedTimestamp from thread in cache:',
                err);
          });
        }

        console.debug(
            '[threadListAvatars] Invalidating thread', entry.threadId);
        return this.invalidateCacheEntryIfExists(entry.threadId).catch(err => {
          console.error(
              '[threadListAvatars] Error while invalidating thread from cache:',
              err);
        });
      }));
    });

    Promise.allSettled(promises).then(() => {
      if (Math.random() < probRemoveUnusedCacheEntries)
        this.removeUnusedCacheEntries().catch(err => {
          console.error(
              '[threadListAvatars] Error while removing unused cache entries:',
              err);
        });
    });
  }

  handleInvalidationByNewMessage(e) {
    var request = e?.detail?.body;
    var threadId = request?.['2'];
    if (threadId === undefined) {
      console.warn(
          '[threadListAvatars] Thread ID couldn\'t be parsed from the CreateMessage request.');
      return;
    }

    console.debug(
        '[threadListAvatars] Invalidating thread', threadId,
        'due to intercepting a CreateMessage request for that thread.');
    return this.invalidateCacheEntryIfExists(threadId);
  }

  // unauthorizedForums methods:
  isForumUnauthorized(forumId) {
    return this.dbPromise.then(db => db.get('unauthorizedForums', forumId))
        .then(entry => {
          if (entry === undefined) return false;

          var now = Math.floor(Date.now() / 1000);
          if (entry.expirationTimestamp > now) return true;

          this.invalidateUnauthorizedForum(forumId);
          return false;
        });
  }

  putUnauthorizedForum(forumId) {
    return this.dbPromise.then(db => db.put('unauthorizedForums', {
      forumId,
      expirationTimestamp:
          Math.floor(Date.now() / 1000) + unauthorizedForumExpirationTime,
    }));
  }

  invalidateUnauthorizedForum(forumId) {
    return this.dbPromise.then(db => db.delete('unauthorizedForums', forumId));
  }
};
