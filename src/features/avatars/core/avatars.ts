import { waitFor } from 'poll-until-promise';

import { CCApi } from '../../../common/api.js';
import { parseUrl } from '../../../common/commonUtils.js';
import PartialOptionsWatcher from '../../../common/options/partialOptionsWatcher.js';
import { createPlainTooltip } from '../../../common/tooltip.js';

import AvatarsDB from './AvatarsDB';
import { AvatarsCacheEntry } from './dbSchema.js';
import { ProtobufNumber } from '@/common/protojs/protojs.types.js';

/** The avatars list could be retrieved. */
const STATE_OK = 'ok' as const;
type STATE_OK = typeof STATE_OK;
/** The thread is in a private forum, so the avatars list could not be retrieved. */
const STATE_PRIVATE = 'private' as const;
type STATE_PRIVATE = typeof STATE_PRIVATE;
/** The thread has the visible field set to false. */
const STATE_NOT_VISIBLE = 'notVisible' as const;
type STATE_NOT_VISIBLE = typeof STATE_NOT_VISIBLE;

type State = STATE_OK | STATE_PRIVATE | STATE_NOT_VISIBLE;

type MessagesResult =
  | {
      state: STATE_OK;
      messages: any[];
      author: any;
      lastMessageId: ProtobufNumber;
    }
  | {
      state: Exclude<State, STATE_OK>;
    };

type Result =
  | {
      state: STATE_OK;
      /** List of at most `num` avatars for thread `thread`. */
      avatars: string[];
    }
  | {
      state: Exclude<State, STATE_OK>;
    };

type ResultWithAvatars = {
  state: State;
  /** List of at most `num` avatars for thread `thread`. */
  avatars: string[];
};

type CacheResult =
  | { found: true; entry: AvatarsCacheEntry }
  | {
      found: false;
    };

type Thread = {
  forum: string;
  thread: string;
};

export default class AvatarsHandler {
  private isFilterSetUp: boolean;
  private privateForums: string[];
  private readonly db: AvatarsDB;
  private optionsWatcher: PartialOptionsWatcher;

  constructor() {
    this.isFilterSetUp = false;
    this.privateForums = [];
    this.db = new AvatarsDB();
    this.optionsWatcher = new PartialOptionsWatcher(['threadlistavatars']);

    // Preload whether the option is enabled or not. This is because in the case
    // avatars should be injected, if we don't preload this the layout will
    // shift when injecting the first avatar.
    this.isEnabled().then((isEnabled) => {
      if (isEnabled)
        document.body.classList.add('TWPT-threadlistavatars-enabled');
    });
  }

  // Returns a promise resolving to whether the threadlistavatars feature is
  // enabled.
  isEnabled(): Promise<boolean> {
    return this.optionsWatcher.isEnabled('threadlistavatars');
  }

  // Gets a list of private forums. If it is already cached, the cached list is
  // returned; otherwise it is also computed and cached.
  getPrivateForums(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (this.isFilterSetUp) return resolve(this.privateForums);

      if (!document.documentElement.hasAttribute('data-startup'))
        return reject("[threadListAvatars] Couldn't get startup data.");

      const startupData = JSON.parse(
        document.documentElement.getAttribute('data-startup'),
      );
      const forums = startupData?.['1']?.['2'];
      if (forums === undefined)
        return reject(
          "[threadListAvatars] Couldn't retrieve forums from startup data.",
        );

      for (const f of forums) {
        const forumId = f?.['2']?.['1']?.['1'];
        const forumVisibility = f?.['2']?.['18'];
        if (forumId === undefined || forumVisibility === undefined) {
          console.warn(
            "[threadListAvatars] Coudln't retrieve forum id and/or forum visibility for the following forum:",
            f,
          );
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
  // This function returns whether the thread belongs to a known private forum.
  async isPrivateThread(thread: Thread): Promise<boolean> {
    const privateForums = await this.getPrivateForums();
    if (privateForums.includes(thread.forum)) return true;

    return this.db.isForumUnauthorized(thread.forum);
  }

  // Get an object with the author of the thread, an array of the first |num|
  // replies from the thread |thread|, and additional information about the
  // thread.
  //
  // It also returns |state| which can be 'ok', 'private' or 'notVisible'. If it
  // is 'private' or 'notVisible', the previous properties will be missing.
  getFirstMessages(thread: Thread, num = 15): Promise<MessagesResult> {
    return CCApi(
      'ViewThread',
      {
        1: thread.forum,
        2: thread.thread,
        // options
        3: {
          // pagination
          1: {
            2: num, // maxNum
          },
          3: true, // withMessages
          5: true, // withUserProfile
          10: false, // withPromotedMessages
          16: false, // withThreadNotes
          18: true, // sendNewThreadIfMoved
          23: true, // withFlattenedMessages
        },
      },
      // |authentication| is false because otherwise this would mark
      // the thread as read as a side effect, and that would mark all
      // threads in the list as read.
      //
      // Due to the fact that we have to call this endpoint
      // anonymously, this means we can't retrieve information about
      // threads in private forums.
      /* authentication = */ false,
      /* authuser = */ 0,
      /* returnUnauthorizedStatus = */ true,
    )
      .then<MessagesResult>((response: any) => {
        if (response.unauthorized) {
          return this.db.putUnauthorizedForum(thread.forum).then(() => {
            return {
              state: STATE_PRIVATE,
            };
          });
        }

        const data = response.body;

        const numMessages = data?.['1']?.['8'];
        if (numMessages === undefined) {
          if (data?.['1']?.['10'] === false) {
            return {
              state: STATE_NOT_VISIBLE,
            };
          } else {
            throw new Error(
              "Request to view thread doesn't include the number of messages",
            );
          }
        }

        const messages = numMessages == 0 ? [] : data?.['1']['3'];
        if (messages === undefined) {
          throw new Error(
            'numMessages was ' +
              numMessages +
              " but the response didn't include any message.",
          );
        }

        const author = data?.['1']?.['4'];
        if (author === undefined) {
          throw new Error("Author isn't included in the ViewThread response.");
        }

        return {
          state: STATE_OK,
          messages,
          author,

          // The following fields are useful for the cache and can be
          // undefined, but this is checked before adding an entry to the
          // cache.
          lastMessageId: data?.['1']?.['2']?.['10'],
        };
      })
      .catch((cause) => {
        throw new Error('Failed ViewThread request.', { cause });
      });
  }

  // Get the following data:
  // - |state|: the state of the request (can be 'ok', 'private' or
  // 'notVisible').
  // - |avatars|: a list of at most |num| avatars for thread |thread| by calling
  // the API, if |state| is 'ok'.
  getVisibleAvatarsFromServer(thread: Thread, num: number): Promise<Result> {
    return this.getFirstMessages(thread).then((result) => {
      if (result.state != 'ok')
        return {
          state: result.state,
        };

      const messages = result.messages;
      const author = result.author;
      const lastMessageId = result.lastMessageId;

      const avatars = [];

      const authorUrl = author?.['1']?.['2'];
      if (authorUrl !== undefined)
        avatars.push({ url: authorUrl, timestamp: 0 });

      for (const m of messages) {
        const url = m?.['3']?.['1']?.['2'];
        if (url === undefined) continue;

        const timestamp = m?.['1']?.['1']?.['2'];
        avatars.push({ url, timestamp });

        m?.[12]?.forEach?.((messageOrGap: any) => {
          if (!messageOrGap[1]) return;

          const url = messageOrGap[1]?.[3]?.[1]?.[2];
          if (url === undefined) return;

          const timestamp = messageOrGap[1]?.[1]?.[1]?.[2];
          avatars.push({ url, timestamp });
        });
      }
      avatars.sort((a, b) => {
        // If a timestamp is undefined, we'll push it to the end of the list
        if (a === undefined && b === undefined) return 0; // both are equal
        if (a === undefined) return 1; // b goes first
        if (b === undefined) return -1; // a goes first
        return a.timestamp - b.timestamp; // Old avatars go first
      });

      const avatarUrls: string[] = [];

      for (const a of avatars) {
        const url = a.url;

        if (url === undefined) continue;
        if (!avatarUrls.includes(url)) avatarUrls.push(url);
        if (avatarUrls.length == 3) break;
      }

      // Add entry to cache if all the extra metadata could be retrieved.
      if (lastMessageId !== undefined)
        this.db.putCacheEntry({
          threadId: thread.thread,
          lastMessageId: lastMessageId.toString(),
          avatarUrls,
          num,
          lastUsedTimestamp: Math.floor(Date.now() / 1000),
        });

      return {
        state: STATE_OK,
        avatars: avatarUrls,
      };
    });
  }

  // Returns an object with a cache entry that matches the request if found (via
  // the |entry| property). The property |found| indicates whether the cache
  // entry was found.
  //
  // The |checkRecent| parameter is used to indicate whether lastUsedTimestamp
  // must be within the last 30 seconds (which means that the thread has been
  // checked for a potential invalidation).
  getVisibleAvatarsFromCache(
    thread: Thread,
    num: number,
    checkRecent: boolean,
  ): Promise<CacheResult> {
    return this.db.getCacheEntry(thread.thread).then((entry) => {
      if (entry === undefined || entry.num < num)
        return {
          found: false,
        };

      if (checkRecent) {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - entry.lastUsedTimestamp;
        if (diff > 30)
          throw new Error(
            "lastUsedTimestamp isn't within the last 30 seconds (id: " +
              thread.thread +
              ' the difference is: ' +
              diff +
              ').',
          );
      }

      return {
        found: true,
        entry,
      };
    });
  }

  // Waits for the XHR interceptor to invalidate any outdated threads and
  // returns what getVisibleAvatarsFromCache returns. If this times out, it
  // returns the current cache entry anyways if it exists.
  getVisibleAvatarsFromCacheAfterInvalidations(
    thread: Thread,
    num: number,
  ): Promise<CacheResult> {
    return waitFor(
      () =>
        this.getVisibleAvatarsFromCache(thread, num, /* checkRecent = */ true),
      {
        interval: 450,
        timeout: 2 * 1000,
      },
    ).catch((err) => {
      console.debug(
        '[threadListAvatars] Error while retrieving avatars from cache ' +
          '(probably timed out waiting for lastUsedTimestamp to change):',
        err,
      );

      // Sometimes when going back to a thread list, the API call to load
      // the thread list is not made, and so the previous piece of code
      // times out waiting to intercept that API call and handle thread
      // invalidations.
      //
      // If this is the case, this point will be reached. We'll assume we
      // intercept all API calls, so reaching this point means that an API
      // call wasn't made. Therefore, try again to get visible avatars from
      // the cache without checking whether the entry has been checked for
      // potential invalidation.
      //
      // See https://bugs.avm99963.com/p/twpowertools/issues/detail?id=10.
      return this.getVisibleAvatarsFromCache(
        thread,
        num,
        /* checkRecent = */ false,
      );
    });
  }

  // Get an object with the following data:
  // - |state|: 'ok' (the avatars list could be retrieved), 'private' (the
  // thread is in a private forum, so the avatars list could not be retrieved),
  // or 'notVisible' (the thread has the visible field set to false).
  // - |avatars|: list of at most |num| avatars for thread |thread|
  async getVisibleAvatars(thread: Thread, num = 3): Promise<ResultWithAvatars> {
    const isPrivate = await this.isPrivateThread(thread);
    if (isPrivate) {
      return {
        state: STATE_PRIVATE,
        avatars: [],
      };
    }

    return this.getVisibleAvatarsFromCacheAfterInvalidations(thread, num)
      .then((res) => {
        if (!res.found) {
          const err = new Error("Cache entry doesn't exist.");
          err.name = 'notCached';
          throw err;
        }
        return {
          state: STATE_OK,
          avatars: res.entry.avatarUrls,
        };
      })
      .catch((err) => {
        // If the name is "notCached", then this is not an actual error so
        // don't log an error, but still get avatars from the server.
        if (err?.name !== 'notCached')
          console.error(
            '[threadListAvatars] Error while accessing avatars cache:',
            err,
          );

        return this.getVisibleAvatarsFromServer(thread, num).then((res) => {
          if (res.state != 'ok')
            return {
              state: res.state,
              avatars: [] as string[],
            };

          return {
            state: STATE_OK,
            avatars: res.avatars,
          };
        });
      });
  }

  // Inject avatars for thread summary (thread item) |node| in a thread list.
  inject(node: HTMLElement) {
    const header = node.querySelector(
      'ec-thread-summary .main-header .action .header',
    );
    const headerContent = header.querySelector(':scope > .header-content');
    const expandBtn = header.querySelector(':scope > .expand-button');
    if (headerContent === null) {
      console.error(
        "[threadListAvatars] Header is not present in the thread item's DOM.",
      );
      return;
    }
    if (!(headerContent instanceof HTMLAnchorElement)) {
      console.error('[threadListAvatars] Header is not an anchor element.');
      return;
    }
    if (expandBtn === null) {
      console.error(
        "[threadListAvatars] Expand button is not present in the thread item's DOM.",
      );
      return;
    }

    const thread = parseUrl(headerContent.href);
    if (thread === false) {
      console.error("[threadListAvatars] Thread's link cannot be parsed.");
      return;
    }

    this.getVisibleAvatars(thread)
      .then((res) => {
        const avatarsContainer = document.createElement('div');
        avatarsContainer.classList.add('TWPT-avatars');

        const avatarUrls = res.avatars;

        let singleAvatar;
        if (res.state == 'private' || res.state == 'notVisible') {
          singleAvatar = document.createElement('div');
          singleAvatar.classList.add('TWPT-avatar-private-placeholder');
          singleAvatar.textContent =
            res.state == 'private' ? 'person_off' : 'visibility_off';
          avatarsContainer.appendChild(singleAvatar);
        } else {
          for (let i = 0; i < avatarUrls.length; ++i) {
            const avatar = document.createElement('div');
            avatar.classList.add('TWPT-avatar');
            avatar.style.backgroundImage = "url('" + avatarUrls[i] + "')";
            avatarsContainer.appendChild(avatar);
          }
        }

        header.insertBefore(avatarsContainer, expandBtn);

        if (res.state == 'private') {
          const label = chrome.i18n.getMessage(
            'inject_threadlistavatars_private_thread_indicator_label',
          );
          createPlainTooltip(singleAvatar, label);
        }
        if (res.state == 'notVisible') {
          const label = chrome.i18n.getMessage(
            'inject_threadlistavatars_invisible_thread_indicator_label',
          );
          createPlainTooltip(singleAvatar, label);
        }
      })
      .catch((err) => {
        console.error(
          '[threadListAvatars] Could not retrieve avatars for thread',
          thread,
          err,
        );
      });
  }

  // Inject avatars for thread summary (thread item) |node| in a thread list if
  // the threadlistavatars option is enabled.
  injectIfEnabled(node: HTMLElement) {
    this.isEnabled().then((isEnabled) => {
      if (isEnabled) {
        document.body.classList.add('TWPT-threadlistavatars-enabled');
        this.inject(node);
      } else {
        document.body.classList.remove('TWPT-threadlistavatars-enabled');
      }
    });
  }
}
