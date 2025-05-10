import { Forum } from '../../../../domain/forum';

export const EVENT_LOADED_FULL_FORUM_INFO = 'loaded-full-forum-info';

declare global {
  interface WindowEventMap {
    [EVENT_LOADED_FULL_FORUM_INFO]: CustomEvent<{
      forum: Forum;
    }>;
  }
}
