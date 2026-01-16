import { CCApi } from '../../../../../../common/api';
import {
  ItemToReport,
  ReportAbuseReposioryPort,
} from '../../../ui/injectors/bulkReportControls.injector.adapter';

export class ReportAbuseRepositoryAdapter implements ReportAbuseReposioryPort {
  async report(messageInfo: ItemToReport): Promise<void> {
    return await CCApi(
      'UserFlag',
      {
        1: messageInfo.forumId,
        3: messageInfo.threadId,
        4: messageInfo.messageId,
      },
      /* authenticated = */ true,
    );
  }
}
