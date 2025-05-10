import { CCApi } from '../../../../../common/api';
import { Forum } from '../../../../../domain/forum';
import { GetForumRepositoryPort } from '../../../ui/ports/getForum.repository.port';
import { ForumsFactory } from '../../factories/forums.factory';

export class GetForumRepositoryAdapter implements GetForumRepositoryPort {
  private readonly forumsFactory = new ForumsFactory();

  async getForum(
    forumId: string,
    displayLanguage: string,
    authuser: string,
  ): Promise<Forum> {
    const response = await CCApi(
      'GetForum',
      { '1': forumId },
      /* authenticated = */ true,
      authuser as any, // TODO: Fix type
    );

    return this.forumsFactory.convertProtobufProductForumToEntity(
      response,
      displayLanguage,
    );
  }
}
