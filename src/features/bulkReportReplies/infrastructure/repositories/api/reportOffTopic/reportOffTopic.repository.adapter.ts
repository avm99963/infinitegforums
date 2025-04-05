import { CCApi } from '../../../../../../common/api';
import {
  MessageInfo,
  ReportOffTopicRepositoryPort,
} from '../../../ui/injectors/bulkReportControls.injector.adapter';

export class ReportOffTopicRepositoryAdapter implements ReportOffTopicRepositoryPort {
  async report(messageInfo: MessageInfo): Promise<void> {
    return await CCApi(
      'SetOffTopic',
      {
        1: messageInfo.forumId,
        2: messageInfo.threadId,
        3: messageInfo.messageId,
      },
      /* authenticated = */ true,
    );
  }
}
