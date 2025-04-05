import { ReportType } from "../domain/reportType";

export const kEventReportReply = 'twpt-bulk-report-replies-report-reply';

declare global {
  interface WindowEventMap {
    [kEventReportReply]: CustomEvent<{
      forumId: string;
      threadId: string;
      messageId: string;
      type: ReportType;
    }>;
  }
}
