import { ReportTypeValues } from '../../../domain/reportType';
import BulkReportControls from '../../../ui/components/BulkReportControls';
import { kEventReport } from '../../../ui/events/events';
import { BulkReportControlsInjectorPort } from '../../../ui/injectors/bulkReportControls.injector.port';

export interface ItemToReport {
  forumId: string;
  threadId: string;
  messageId?: string;
}

export interface MessageInfoRepositoryPort {
  getInfo(elementInsideMessage: Element): ItemToReport;
}

export interface ReportOffTopicRepositoryPort {
  report(messageInfo: ItemToReport): Promise<void>;
}

export interface ReportAbuseReposioryPort {
  report(messageInfo: ItemToReport): Promise<void>;
}

export class BulkReportControlsInjectorAdapter implements BulkReportControlsInjectorPort {
  constructor(
    private messageInfoRepository: MessageInfoRepositoryPort,
    private reportOffTopicRepository: ReportOffTopicRepositoryPort,
    private reportAbuseRepository: ReportAbuseReposioryPort,
  ) {}

  inject(actionsContainer: Element) {
    const messageInfo = this.messageInfoRepository.getInfo(actionsContainer);

    const controls = document.createElement('bulk-report-controls');
    controls.setAttribute('forumId', messageInfo.forumId);
    controls.setAttribute('threadId', messageInfo.threadId);
    if (messageInfo.messageId !== undefined) {
      controls.setAttribute('messageId', messageInfo.messageId);
    }
    actionsContainer.append(controls);

    this.addEventHandlers(controls);
  }

  private addEventHandlers(controls: BulkReportControls) {
    controls.addEventListener(
      kEventReport,
      async (e: WindowEventMap[typeof kEventReport]) => {
        const { detail } = e;

        let statusProperty: string | undefined;
        switch (detail.type) {
          case ReportTypeValues.OffTopic:
            statusProperty = 'offTopicStatus';
            break;

          case ReportTypeValues.Abuse:
            statusProperty = 'abuseStatus';
            break;
        }
        controls.setAttribute(statusProperty, 'processing');

        const messageInfo = {
          forumId: detail.forumId,
          threadId: detail.threadId,
          messageId: detail.messageId,
        };

        try {
          switch (detail.type) {
            case ReportTypeValues.OffTopic:
              await this.reportOffTopicRepository.report(messageInfo);
              break;

            case ReportTypeValues.Abuse:
              await this.reportAbuseRepository.report(messageInfo);
              break;
          }
          controls.setAttribute(statusProperty, 'done');
        } catch (error) {
          console.error(
            `[bulk-report-controls] Error reporting message ${JSON.stringify(messageInfo)} (${detail.type}):`,
            error,
          );
          controls.setAttribute(statusProperty, 'idle');
          // TODO: Create a snackbar instead of showing an alert.
          alert(
            `An error occured while reporting the message:\n${error}` +
              (!navigator.onLine
                ? "\n\nYou don't seem to be connected to the Internet."
                : ''),
          );
        }
      },
    );
  }
}
