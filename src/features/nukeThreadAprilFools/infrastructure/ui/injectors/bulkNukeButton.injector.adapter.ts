import type BulkNukeModal from '@/features/nukeThreadAprilFools/ui/components/BulkNukeModal';
import { BulkNukeButtonInjectorPort } from '@/features/nukeThreadAprilFools/ui/injectors/bulkNukeButton.injector.port';
import { UnexpectedUIError } from '@/ui/errors/unexpectedUI.error';
import { ThreadListActionInjectorPort } from '@/ui/injectors/threadListAction.injector.port';

const BULK_NUKE_ACTION_KEY = 'bulk-nuke';

export class BulkNukeButtonInjectorAdapter implements BulkNukeButtonInjectorPort {
  private modal: BulkNukeModal | undefined;

  constructor(private readonly buttonInjector: ThreadListActionInjectorPort) {}

  execute() {
    const button = document.createElement('twpt-bulk-nuke-button');
    button.addEventListener('click', () => this.showModal());

    this.buttonInjector.execute({
      element: button,
      key: BULK_NUKE_ACTION_KEY,
    });
  }

  private showModal() {
    if (this.modal === undefined || !document.body.contains(this.modal)) {
      this.injectModal();
    }

    if (this.modal === undefined) {
      throw new Error(
        'We just injected the modal, but the modal property is unexpectedly undefined.',
      );
    }

    this.modal.setAttribute('open', '');
  }

  private injectModal() {
    try {
      const overlay = this.getOverlay();
      this.modal = document.createElement('twpt-bulk-nuke-modal');
      overlay.append(this.modal);
    } catch (e) {
      throw Error(`Couldn't inject modal.`, { cause: e });
    }
  }

  private getOverlay() {
    const overlay = document.getElementById('default-acx-overlay-container');
    if (overlay === null) {
      throw new UnexpectedUIError("The overlay doesn't exist.");
    }
    return overlay;
  }
}
