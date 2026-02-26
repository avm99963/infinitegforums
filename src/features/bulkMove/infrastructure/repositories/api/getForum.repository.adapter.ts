import { CommunityConsoleApiClientPort } from '@/services/communityConsole/api/CommunityConsoleApiClient.port';
import { Forum } from '../../../../../domain/forum';
import { GetForumRepositoryPort } from '../../../ui/ports/getForum.repository.port';
import { ForumsFactory } from '../../factories/forums.factory';

export class GetForumRepositoryAdapter implements GetForumRepositoryPort {
  private readonly forumsFactory = new ForumsFactory();

  constructor(private apiClient: CommunityConsoleApiClientPort) {}

  async getForum(forumId: string, displayLanguage: string): Promise<Forum> {
    const response = await this.apiClient.send(
      'GetForum',
      { '1': forumId },
      { authenticated: true },
    );

    return this.forumsFactory.convertProtobufProductForumToEntity(
      response,
      displayLanguage,
    );
  }
}
