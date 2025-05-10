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
import {
  GetSelectedThreadsServicePort,
  SelectedThread,
} from '../../../../../ui/services/getSelectedThreads.service.port';

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
    private readonly getSelectedThreadsService: GetSelectedThreadsServicePort,
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
    const selectedThreads = this.getSelectedThreadsService.execute();
    const mockProgress = this.createInitialProgress(
      selectedThreads,
      e.detail.destinationForumId,
    );
    this.progressModal.setAttribute('progress', JSON.stringify(mockProgress));
    this.progressModal.setAttribute('open', '');
    // TODO: Actually move the threads.
  }

  private createInitialProgress(
    selectedThreads: SelectedThread[],
    destinationForumId: string,
  ): ThreadProgress[] {
    return selectedThreads.map((thread) => {
      return {
        originalThread: {
          forumId: thread.forumId,
          id: thread.id,
          title: thread.title,
        },
        destinationForumId,
        status: 'waiting',
      };
    });
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
