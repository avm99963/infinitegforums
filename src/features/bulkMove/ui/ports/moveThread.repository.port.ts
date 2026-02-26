import { ThreadProperty } from '@/domain/threadProperty';

export interface MoveThreadRequest {
  oldForumId: string;
  threadId: string;
  destination: {
    forumId: string;
    language: string;
    categoryId: string;
    properties?: ThreadProperty[];
  };
}

export interface MoveThreadRepositoryPort {
  move(request: MoveThreadRequest): Promise<void>;
}
