import { CCApi } from '../../../../../common/api';
import {
  MoveThreadRepositoryPort,
  MoveThreadRequest,
} from '../../../ui/ports/moveThread.repository.port';
import { ThreadPropertiesFactory } from '../../factories/threadProperties.factory';

export class BulkMoveThreadsRepositoryAdapter
  implements MoveThreadRepositoryPort
{
  private readonly threadPropertiesFactory = new ThreadPropertiesFactory();

  async move(request: MoveThreadRequest, authuser: string): Promise<void> {
    await CCApi(
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
      /* authenticated = */ true,
      authuser as any, // TODO: Fix type
    );
  }
}
