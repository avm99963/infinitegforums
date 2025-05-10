import { Forum } from "../../../../domain/forum";

export interface GetForumRepositoryPort {
  getForum(forumId: string, displayLanguage: string, authuser: string): Promise<Forum>;
}
