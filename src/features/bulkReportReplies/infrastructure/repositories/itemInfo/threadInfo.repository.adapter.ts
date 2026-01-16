import { UrlThreadDataParserServicePort } from '@/ui/services/urlThreadDataParser.service.port';
import {
  ItemToReport,
  MessageInfoRepositoryPort,
} from '../../ui/injectors/bulkReportControls.injector.adapter';

export class ThreadInfoRepositoryAdapter implements MessageInfoRepositoryPort {
  constructor(
    private readonly urlThreadDataParser: UrlThreadDataParserServicePort,
  ) {}

  getInfo(): ItemToReport {
    const threadData = this.urlThreadDataParser.execute(window.location.href);

    return {
      forumId: threadData.forumId,
      threadId: threadData.threadId,
    };
  }
}
