import {
  ThreadListActionInjectorOptions,
  ThreadListActionInjectorPort,
} from '../../../../ui/injectors/threadListAction.injector.port';

export class CCThreadListActionInjectorAdapter
  implements ThreadListActionInjectorPort
{
  execute({ element, key }: ThreadListActionInjectorOptions): boolean {
    const actionsContainer = document.querySelector('ec-bulk-actions .actions');
    if (actionsContainer === null) {
      throw new Error('Could not find thread list actions container.');
    }

    if (!this.shouldAddNodeToActionBar(key, actionsContainer)) {
      return false;
    }

    // We provide a fallback just in case the duplicate button disappears for
    // some reason.
    const referenceBtn =
      actionsContainer.querySelector('[debugid="mark-duplicate-button"]') ??
      actionsContainer.querySelector(
        '[debugid="mark-read-button"], [debugid="mark-unread-button"]',
      );
    if (referenceBtn === null) {
      throw new Error(
        'Could not find a reference button in the bulk actions toolbar.',
      );
    }

    element.setAttribute('debugid', key);
    referenceBtn.after(element);
    return true;
  }

  private shouldAddNodeToActionBar(key: string, actionsContainer: Element) {
    return !actionsContainer.querySelector(`[debugid="${key}"]`);
  }
}
