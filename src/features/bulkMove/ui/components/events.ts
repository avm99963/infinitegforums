import { ThreadProperty } from '../../../../domain/threadProperty';

export const EVENT_START_BULK_MOVE = 'twpt-start-bulk-move';

declare global {
  interface GlobalEventHandlersEventMap {
    [EVENT_START_BULK_MOVE]: CustomEvent<{
      destinationForumId: string;
      language: string;
      categoryId: string;
      properties: ThreadProperty[];
    }>;
  }
}
