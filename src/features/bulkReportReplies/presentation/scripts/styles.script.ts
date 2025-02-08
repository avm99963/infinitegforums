import StylesheetScript from '../../../../common/architecture/scripts/stylesheet/StylesheetScript';

export default class BulkReportRepliesStylesScript extends StylesheetScript {
  stylesheet = 'css/bulk_report_replies.css';
  page: never;

  async shouldBeInjected(): Promise<boolean> {
    return true;
  }
}
