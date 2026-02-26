import { CommunityConsoleApiClientPort } from '@/services/communityConsole/api/CommunityConsoleApiClient.port';
import {
  MoveThreadRepositoryPort,
  MoveThreadRequest,
} from '../../../ui/ports/moveThread.repository.port';
import { ThreadPropertiesFactory } from '../../factories/threadProperties.factory';

export class BulkMoveThreadsRepositoryAdapter implements MoveThreadRepositoryPort {
  private readonly threadPropertiesFactory = new ThreadPropertiesFactory();

  constructor(private apiClient: CommunityConsoleApiClientPort) {}

  async move(request: MoveThreadRequest): Promise<void> {
    await this.apiClient.send(
      'MoveThread',
      {
        '1': request.oldForumId,
        '2': request.threadId,
        '3': request.destination.forumId,
        '4': request.destination.categoryId,
        '5': request.destination.language,
        '6': this.threadPropertiesFactory.convertEntityListToProtobuf(
          request.destination.properties ?? [],
        ),
      },
      { authenticated: true },
    );
  }
}
