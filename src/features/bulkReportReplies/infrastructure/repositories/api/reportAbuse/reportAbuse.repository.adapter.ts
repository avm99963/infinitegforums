import { CommunityConsoleApiClientPort } from '@/services/communityConsole/api/CommunityConsoleApiClient.port';
import {
  ItemToReport,
  ReportAbuseReposioryPort,
} from '../../../ui/injectors/bulkReportControls.injector.adapter';

export class ReportAbuseRepositoryAdapter implements ReportAbuseReposioryPort {
  constructor(private apiClient: CommunityConsoleApiClientPort) {}

  async report(messageInfo: ItemToReport): Promise<void> {
    return await this.apiClient.send(
      'UserFlag',
      {
        1: messageInfo.forumId,
        3: messageInfo.threadId,
        4: messageInfo.messageId,
      },
      { authenticated: true },
    );
  }
}
