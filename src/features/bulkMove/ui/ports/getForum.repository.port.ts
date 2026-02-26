import { Forum } from '@/domain/forum';
import { createContext } from '@lit/context';

export interface GetForumRepositoryPort {
  getForum(forumId: string, displayLanguage: string): Promise<Forum>;
}

export const getForumRepositoryContext = createContext<GetForumRepositoryPort>(
  'bulk-move-get-forum-repository',
);
