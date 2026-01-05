import { IDBPDatabase, openDB } from 'idb';
import { AvatarsCacheEntry, AvatarsDBSchema } from './dbSchema';
import { InterceptorEvent } from '@/xhrInterceptor/domain/event';

const dbName = 'TWPTAvatarsDB';
const threadListRequestEvent = 'TWPT_ViewForumRequest';
const threadListLoadEvent = 'TWPT_ViewForumResponse';
const createMessageLoadEvent = 'TWPT_CreateMessageRequest';
// Time after the last use when a cache entry should be deleted (in s):
const cacheExpirationTime = 4 * 24 * 60 * 60; // 4 days
// Probability of running the piece of code to remove unused cache entries after
// loading the thread list.
const probRemoveUnusedCacheEntries = 0.1; // 10%

// Time after which an unauthorized forum entry expires (in s).
const unauthorizedForumExpirationTime = 1 * 24 * 60 * 60; // 1 day

export default class AvatarsDB {
  private dbPromise: Promise<IDBPDatabase<AvatarsDBSchema>>;

  constructor() {
    this.openDB();
    this.setUpInvalidationsHandlers();
  }

  private openDB() {
    this.dbPromise = openDB(dbName, 1, {
      upgrade: (udb, oldVersion, newVersion, transaction) => {
        switch (oldVersion) {
          case 0:
            const cache = udb.createObjectStore('avatarsCache', {
              keyPath: 'threadId',
            });
            cache.createIndex('lastUsedTimestamp', 'lastUsedTimestamp', {
              unique: false,
            });

            const unauthedForums = udb.createObjectStore('unauthorizedForums', {
              keyPath: 'forumId',
            });
            unauthedForums.createIndex(
              'expirationTimestamp',
              'expirationTimestamp',
              { unique: false },
            );
        }
      },
    });
  }

  // avatarsCache methods:
  async getCacheEntry(threadId: string) {
    const db = await this.dbPromise;
    return db.get('avatarsCache', threadId);
  }

  async putCacheEntry(entry: AvatarsCacheEntry) {
    const db = await this.dbPromise;
    return db.put('avatarsCache', entry);
  }

  async invalidateCacheEntryIfExists(threadId: string) {
    const db = await this.dbPromise;
    db.delete('avatarsCache', threadId);
  }

  async removeUnusedCacheEntries() {
    console.debug('[threadListAvatars] Removing unused cache entries...');
    const db = await this.dbPromise;

    const upperBoundTimestamp =
      Math.floor(Date.now() / 1000) - cacheExpirationTime;
    const range = IDBKeyRange.upperBound(upperBoundTimestamp);

    const tx = db.transaction('avatarsCache', 'readwrite');
    const index = tx.store.index('lastUsedTimestamp');
    const cursor = await index.openCursor(range);
    while (cursor) {
      cursor.delete();
      await cursor.continue();
    }
  }

  setUpInvalidationsHandlers() {
    let ignoredRequests: number[] = [];

    window.addEventListener(
      threadListRequestEvent,
      (e: InterceptorEvent<any>) => {
        // Ignore ViewForum requests made by the chat feature, the "Mark as
        // duplicate" dialog, and the counters in the drawer next to some filters.
        //
        // All those requests have |maxNum| set to 10, 20 and 1000 respectively,
        // while the requests that we want to handle are the ones to initially
        // load the thread list (which currently requests 100 threads) and the
        // ones to load more threads (which request 50 threads).
        //
        // Another edge case are requests set to 0. These are requests for the
        // counters in the drawer that were modified by the fixPEKB381989895
        // feature.
        const maxNum = e.detail.body?.['2']?.['1']?.['2'];
        if (maxNum == 10 || maxNum == 20 || maxNum == 1000 || maxNum == 0) {
          ignoredRequests.push(e.detail.id);
        }
      },
    );
    window.addEventListener(threadListLoadEvent, (e: InterceptorEvent<any>) => {
      if (ignoredRequests.includes(e.detail.id)) {
        ignoredRequests = ignoredRequests.filter((item) => item != e.detail.id);
        return;
      }

      this.handleInvalidationsByListLoad(e);
    });
    window.addEventListener(
      createMessageLoadEvent,
      (e: InterceptorEvent<any>) => this.handleInvalidationByNewMessage(e),
    );
  }

  handleInvalidationsByListLoad(e: InterceptorEvent<any>) {
    const response = e?.detail?.body;
    const threads = response?.['1']?.['2'];
    if (threads === undefined) {
      console.warn(
        "[threadListAvatars] The thread list doesn't contain any threads.",
      );
      return;
    }

    const promises: Promise<unknown>[] = [];
    threads.forEach((t: any) => {
      const id = t?.['2']?.['1']?.['1'];
      const currentLastMessageId = t?.['2']?.['10'];

      if (id === undefined) return;

      promises.push(
        this.getCacheEntry(id).then((entry) => {
          if (entry === undefined) return undefined;

          // If the cache entry is still valid.
          if (
            currentLastMessageId !== undefined &&
            String(currentLastMessageId) === entry.lastMessageId
          ) {
            entry.lastUsedTimestamp = Math.floor(Date.now() / 1000);
            return this.putCacheEntry(entry).catch((err) => {
              console.error(
                '[threadListAvatars] Error while updating lastUsedTimestamp from thread in cache:',
                err,
              );
            });
          }

          console.debug(
            '[threadListAvatars] Invalidating thread',
            entry.threadId,
          );
          return this.invalidateCacheEntryIfExists(entry.threadId).catch(
            (err) => {
              console.error(
                '[threadListAvatars] Error while invalidating thread from cache:',
                err,
              );
            },
          );
        }),
      );
    });

    Promise.allSettled(promises).then(() => {
      if (Math.random() < probRemoveUnusedCacheEntries)
        this.removeUnusedCacheEntries().catch((err) => {
          console.error(
            '[threadListAvatars] Error while removing unused cache entries:',
            err,
          );
        });
    });
  }

  handleInvalidationByNewMessage(e: InterceptorEvent<any>) {
    const request = e?.detail?.body;
    const threadId = request?.['2'];
    if (threadId === undefined) {
      console.warn(
        "[threadListAvatars] Thread ID couldn't be parsed from the CreateMessage request.",
      );
      return undefined;
    }

    console.debug(
      '[threadListAvatars] Invalidating thread',
      threadId,
      'due to intercepting a CreateMessage request for that thread.',
    );
    return this.invalidateCacheEntryIfExists(threadId);
  }

  // unauthorizedForums methods:
  async isForumUnauthorized(forumId: string) {
    const db = await this.dbPromise;
    const entry = await db.get('unauthorizedForums', forumId);
    if (entry === undefined) return false;

    const now = Math.floor(Date.now() / 1000);
    if (entry.expirationTimestamp > now) return true;

    await this.invalidateUnauthorizedForum(forumId);
    return false;
  }

  async putUnauthorizedForum(forumId: string) {
    const db = await this.dbPromise;
    await db.put('unauthorizedForums', {
      forumId,
      expirationTimestamp:
        Math.floor(Date.now() / 1000) + unauthorizedForumExpirationTime,
    });
  }

  async invalidateUnauthorizedForum(forumId: string) {
    const db = await this.dbPromise;
    await db.delete('unauthorizedForums', forumId);
  }
}
