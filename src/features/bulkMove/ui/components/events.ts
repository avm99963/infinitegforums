import { Forum } from '../../../../domain/forum';
import { ThreadProperty } from '../../../../domain/threadProperty';

export const EVENT_LOADED_FULL_FORUM_INFO = 'loaded-full-forum-info';
export const EVENT_START_BULK_MOVE = 'twpt-start-bulk-move';

declare global {
  interface GlobalEventHandlersEventMap {
    [EVENT_LOADED_FULL_FORUM_INFO]: CustomEvent<{
      forum: Forum;
    }>;
    [EVENT_START_BULK_MOVE]: CustomEvent<{
      destinationForumId: string;
      language: string;
      categoryId: string;
      properties: ThreadProperty[];
    }>;
  }
}
