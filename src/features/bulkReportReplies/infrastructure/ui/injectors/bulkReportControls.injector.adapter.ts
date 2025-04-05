import { BulkReportControlsInjectorPort } from '../../../ui/injectors/bulkReportControls.injector.port';

export class BulkReportControlsInjectorAdapter
  implements BulkReportControlsInjectorPort
{
  inject(messageActions: Element) {
    const controls = document.createElement('bulk-report-controls');
    // TODO(https://iavm.xyz/b/twpowertools/192): Add message ID to the controls.
    messageActions.append(controls);
  }
}
