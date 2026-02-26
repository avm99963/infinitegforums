import { CommunityConsoleApiClientPort } from '@/services/communityConsole/api/CommunityConsoleApiClient.port';
import {
  ItemToReport,
  ReportOffTopicRepositoryPort,
} from '../../../ui/injectors/bulkReportControls.injector.adapter';

export class ReportOffTopicRepositoryAdapter implements ReportOffTopicRepositoryPort {
  constructor(private apiClient: CommunityConsoleApiClientPort) {}

  async report(messageInfo: ItemToReport): Promise<void> {
    return await this.apiClient.send(
      'SetOffTopic',
      {
        1: messageInfo.forumId,
        2: messageInfo.threadId,
        3: messageInfo.messageId,
      },
      { authenticated: true },
    );
  }
}
