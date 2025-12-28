import { DBSchema } from 'idb';

export interface AvatarsCacheEntry {
  threadId: string;
  lastMessageId: string;
  avatarUrls: string[];
  num: number;
  /** Timestamp of the last use in seconds. */
  lastUsedTimestamp: number;
}

export interface UnauthorizedForumsEntry {
  forumId: string;
  /** Expiration timestamp in seconds. */
  expirationTimestamp: number;
}

export interface AvatarsDBSchema extends DBSchema {
  avatarsCache: {
    /* The key is threadId. */
    key: string;
    value: AvatarsCacheEntry;
    indexes: {
      lastUsedTimestamp: number;
    };
  };
  unauthorizedForums: {
    /* The key is forumID. */
    key: string;
    value: UnauthorizedForumsEntry;
    indexes: {
      expirationTimestamp: number;
    };
  };
}
