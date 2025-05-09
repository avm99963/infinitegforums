import { StartupDataStoragePort } from '../../../../../services/communityConsole/StartupDataStorage.port';
import { ThreadListGenericActionButtonInjectorPort } from '../../../../../ui/injectors/threadListGenericActionButton.injector.port';
import { Forum } from '../../../../../domain/forum';
import BulkMoveModal from '../../../ui/components/BulkMoveModal';
import { BulkMoveButtonInjectorPort } from '../../../ui/injectors/bulkMoveButton.injector.port';
import { ForumsFactory } from './forums.factory';

const BULK_MOVE_ACTION_KEY = 'bulk-move';

export class BulkMoveButtonInjectorAdapter
  implements BulkMoveButtonInjectorPort
{
  private modal: BulkMoveModal | undefined;

  private readonly forumsFactory = new ForumsFactory();

  constructor(
    private readonly buttonInjector: ThreadListGenericActionButtonInjectorPort,
    private readonly startupDataStorage: StartupDataStoragePort,
  ) {}

  execute() {
    const button = this.buttonInjector.execute({
      icon: 'arrow_right_alt',
      key: BULK_MOVE_ACTION_KEY,
    });
    if (button === null) {
      throw new Error(
        "Couldn't inject bulk move button to thread list actions toolbar.",
      );
    }

    button.addEventListener('click', () => this.showModal());
  }

  private showModal() {
    if (this.modal === undefined) {
      this.injectModal();
    }

    this.modal.setAttribute('open', '');
  }

  private injectModal() {
    const overlay = document.getElementById('default-acx-overlay-container');
    if (overlay === null) {
      throw new Error(
        "Couldn't inject modal because the overlay doesn't exist.",
      );
    }

    this.modal = document.createElement('twpt-bulk-move-modal');
    this.modal.setAttribute('forums', JSON.stringify(this.getForums()));
    overlay.append(this.modal);
  }

  private getForums(): Forum[] {
    const startupData = this.startupDataStorage.get();
    const forumsInfo = startupData.getRawForumsInfo();
    const publicForumsInfo = this.getPublicForums(forumsInfo);
    const displayLanguage = startupData.getDisplayLanguage();
    return this.forumsFactory.convertProtobufListToEntities(
      publicForumsInfo,
      displayLanguage,
    );
  }

  private getPublicForums(forums: any) {
    return forums.filter((forumInfo: any) => {
      const forumVisibility = forumInfo?.[2]?.[18];
      const VISIBILITY_PUBLIC = 1;
      // Don't include non-public forums in the list of forums to choose
      // from.
      return forumVisibility == VISIBILITY_PUBLIC;
    });
  }
}
