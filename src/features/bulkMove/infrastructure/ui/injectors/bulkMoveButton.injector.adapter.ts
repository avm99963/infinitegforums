import { StartupDataStoragePort } from '../../../../../services/communityConsole/StartupDataStorage.port';
import { ThreadListGenericActionButtonInjectorPort } from '../../../../../ui/injectors/threadListGenericActionButton.injector.port';
import { Forum } from '../../../../../domain/forum';
import BulkMoveModal from '../../../ui/components/BulkMoveModal';
import { BulkMoveButtonInjectorPort } from '../../../ui/injectors/bulkMoveButton.injector.port';
import { ForumsFactory } from '../../factories/forums.factory';
import StartupDataModel from '../../../../../models/StartupData';
import { EVENT_START_BULK_MOVE } from '../../../ui/components/events';
import BulkMoveProgressModal, {
  ThreadProgress,
} from '../../../ui/components/BulkMoveProgressModal';

const BULK_MOVE_ACTION_KEY = 'bulk-move';

export class BulkMoveButtonInjectorAdapter
  implements BulkMoveButtonInjectorPort
{
  private modal: BulkMoveModal | undefined;
  private progressModal: BulkMoveProgressModal | undefined;

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
    try {
      const overlay = this.getOverlay();

      const startupData = this.startupDataStorage.get();
      this.modal = document.createElement('twpt-bulk-move-modal');
      this.modal.setAttribute(
        'preloadedForums',
        JSON.stringify(this.getForums(startupData)),
      );
      this.modal.setAttribute('authuser', startupData.getAuthUser());
      this.modal.setAttribute(
        'displayLanguage',
        startupData.getDisplayLanguage(),
      );
      this.modal.addEventListener(EVENT_START_BULK_MOVE, (e) => this.move(e));
      overlay.append(this.modal);
    } catch (e) {
      throw Error(`Couldn't inject modal: ${e}`);
    }
  }

  private getForums(startupData: StartupDataModel): Forum[] {
    const forumsInfo = startupData.getRawForumsInfo();
    const publicForumsInfo = this.getPublicForums(forumsInfo);
    const displayLanguage = startupData.getDisplayLanguage();
    return this.forumsFactory.convertProtobufForumInfoListToEntities(
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

  private move(e: GlobalEventHandlersEventMap[typeof EVENT_START_BULK_MOVE]) {
    if (this.progressModal === undefined) {
      this.injectProgressModal();
    }
    const mockProgress: ThreadProgress[] = [
      {
        originalThread: {
          title: 'I want to recover my password plz',
          id: '123',
          forumId: '1',
        },
        destinationForumId: '2',
        status: 'waiting',
      },
      {
        originalThread: {
          title: 'Hacker. HELP!!!',
          id: '124',
          forumId: '1',
        },
        destinationForumId: '2',
        status: 'loading',
      },
      {
        originalThread: {
          title:
            'Ahhhh I am so scared of losing my account. What can I do to fix this? Please reply!!',
          id: '125',
          forumId: '1',
        },
        destinationForumId: '2',
        status: 'success',
      },
      {
        originalThread: {
          title: 'Hi :)',
          id: '126',
          forumId: '1',
        },
        destinationForumId: '2',
        status: 'error',
        errorMessage: 'Permission denied.',
      },
    ];
    // TODO: Change with the real data and actually move the threads.
    this.progressModal.setAttribute('progress', JSON.stringify(mockProgress));
    this.progressModal.setAttribute('open', '');
  }

  private injectProgressModal() {
    try {
      const overlay = this.getOverlay();
      this.progressModal = document.createElement(
        'twpt-bulk-move-progress-modal',
      );
      overlay.append(this.progressModal);
    } catch (e) {
      throw Error(`Couldn't inject progress modal: ${e}`);
    }
  }

  private getOverlay() {
    const overlay = document.getElementById('default-acx-overlay-container');
    if (overlay === null) {
      throw new Error("The overlay doesn't exist.");
    }
    return overlay;
  }
}
