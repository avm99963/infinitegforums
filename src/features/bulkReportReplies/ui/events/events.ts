import { ReportType } from '../../domain/reportType';

export const kEventReport = 'twpt-bulk-report-replies-report';

declare global {
  interface WindowEventMap {
    [kEventReport]: CustomEvent<{
      forumId: string;
      threadId: string;
      messageId?: string;
      type: ReportType;
    }>;
  }
}
