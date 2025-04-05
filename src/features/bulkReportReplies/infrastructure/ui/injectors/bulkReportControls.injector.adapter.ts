import { BulkReportControlsInjectorPort } from '../../../ui/injectors/bulkReportControls.injector.port';

export interface MessageInfo {
  forumId: string;
  threadId: string;
  messageId: string;
}

export interface MessageInfoRepositoryPort {
  getInfo(elementInsideMessage: Element): MessageInfo;
}

export class BulkReportControlsInjectorAdapter
  implements BulkReportControlsInjectorPort
{
  constructor(private messageInfoRepository: MessageInfoRepositoryPort) {}

  inject(messageActions: Element) {
    const { forumId, threadId, messageId } =
      this.messageInfoRepository.getInfo(messageActions);

    const controls = document.createElement('bulk-report-controls');
    controls.setAttribute('forumId', forumId);
    controls.setAttribute('threadId', threadId);
    controls.setAttribute('messageId', messageId);
    messageActions.append(controls);
  }
}
