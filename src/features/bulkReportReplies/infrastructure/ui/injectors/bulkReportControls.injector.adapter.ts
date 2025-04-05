import { ReportTypeValues } from '../../../domain/reportType';
import BulkReportControls from '../../../ui/components/BulkReportControls';
import { kEventReportReply } from '../../../ui/events';
import { BulkReportControlsInjectorPort } from '../../../ui/injectors/bulkReportControls.injector.port';

export interface MessageInfo {
  forumId: string;
  threadId: string;
  messageId: string;
}

export interface MessageInfoRepositoryPort {
  getInfo(elementInsideMessage: Element): MessageInfo;
}

export interface ReportOffTopicRepositoryPort {
  report(messageInfo: MessageInfo): Promise<void>;
}

export interface ReportAbuseReposioryPort {
  report(messageInfo: MessageInfo): Promise<void>;
}

export class BulkReportControlsInjectorAdapter
  implements BulkReportControlsInjectorPort
{
  constructor(
    private messageInfoRepository: MessageInfoRepositoryPort,
    private reportOffTopicRepository: ReportOffTopicRepositoryPort,
    private reportAbuseRepository: ReportAbuseReposioryPort,
  ) {}

  inject(messageActions: Element) {
    const { forumId, threadId, messageId } =
      this.messageInfoRepository.getInfo(messageActions);

    const controls = document.createElement('bulk-report-controls');
    controls.setAttribute('forumId', forumId);
    controls.setAttribute('threadId', threadId);
    controls.setAttribute('messageId', messageId);
    messageActions.append(controls);

    this.addEventHandlers(controls);
  }

  private addEventHandlers(controls: BulkReportControls) {
    controls.addEventListener(
      kEventReportReply,
      async (e: WindowEventMap[typeof kEventReportReply]) => {
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
