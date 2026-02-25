import { StartupDataStoragePort } from '../../../../../services/communityConsole/startupDataStorage/StartupDataStorage.port';
import { ThreadListGenericActionButtonInjectorPort } from '../../../../../ui/injectors/threadListGenericActionButton.injector.port';
import { Forum } from '../../../../../domain/forum';
import BulkMoveModal from '../../../ui/components/BulkMoveModal';
import { BulkMoveButtonInjectorPort } from '../../../ui/injectors/bulkMoveButton.injector.port';
import { ForumsFactory } from '../../factories/forums.factory';
import StartupDataModel from '../../../../../models/StartupData';
import { EVENT_START_BULK_MOVE } from '../../../ui/components/events';
import BulkMoveProgressModal from '../../../ui/components/BulkMoveProgressModal';
import { MoveThreadRepositoryPort } from '../../../ui/ports/moveThread.repository.port';
import {
  GetSelectedThreadsServicePort,
  SelectedThread,
} from '../../../../../ui/services/getSelectedThreads.service.port';
import { ViewSoftRefresherServicePort } from '../../../../../ui/services/viewSoftRefresher.service.port';
import {
  COMPLETE_STATES,
  Status,
  ThreadProgress,
} from '../../../ui/components/dataStructures';

const BULK_MOVE_ACTION_KEY = 'bulk-move';

export class BulkMoveButtonInjectorAdapter
  implements BulkMoveButtonInjectorPort
{
  private modal: BulkMoveModal | undefined;
  private progressModal: BulkMoveProgressModal | undefined;
  private progress: ThreadProgress[] | undefined;

  private readonly forumsFactory = new ForumsFactory();

  constructor(
    private readonly buttonInjector: ThreadListGenericActionButtonInjectorPort,
    private readonly startupDataStorage: StartupDataStoragePort,
    private readonly getSelectedThreadsService: GetSelectedThreadsServicePort,
    private readonly viewSoftRefresher: ViewSoftRefresherServicePort,
    private readonly moveThreadRepository: MoveThreadRepositoryPort,
  ) {}

  execute() {
    this.buttonInjector.execute({
      icon: 'arrow_right_alt',
      key: BULK_MOVE_ACTION_KEY,
      onActivate: () => this.showModal(),
    });
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
      this.modal.addEventListener(EVENT_START_BULK_MOVE, (e) =>
        this.startMove(e),
      );
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

  private startMove(
    e: GlobalEventHandlersEventMap[typeof EVENT_START_BULK_MOVE],
  ) {
    if (this.progressModal === undefined) {
      this.injectProgressModal();
    }
    const selectedThreads = this.getSelectedThreadsService.execute();
    this.progress = this.createInitialProgress(
      selectedThreads,
      e.detail.destinationForumId,
    );
    this.progressModal.setAttribute('progress', JSON.stringify(this.progress));
    this.progressModal.setAttribute('open', '');
    this.move(selectedThreads, e);
  }

  private move(
    selectedThreads: SelectedThread[],
    e: GlobalEventHandlersEventMap[typeof EVENT_START_BULK_MOVE],
  ) {
    const startupData = this.startupDataStorage.get();
    const authuser = startupData.getAuthUser();
    for (const thread of selectedThreads) {
      this.updateThreadProgressStatus(thread.id, 'loading');
      this.moveThreadRepository
        .move(
          {
            threadId: thread.id,
            oldForumId: thread.forumId,
            destination: {
              forumId: e.detail.destinationForumId,
              language: e.detail.language,
              categoryId: e.detail.categoryId,
              properties: e.detail.properties,
            },
          },
          authuser,
        )
        .then(() => {
          this.updateThreadProgressStatus(thread.id, 'success');
        })
        .catch((e) => {
          this.updateThreadProgressStatus(
            thread.id,
            'error',
            e?.message ?? e?.toString?.() ?? `${e}`,
          );
        })
        .then(() => {
          if (this.progress.every((p) => COMPLETE_STATES.includes(p.status))) {
            this.viewSoftRefresher.refresh();
          }
        });
    }
  }

  private updateThreadProgressStatus(
    threadId: string,
    status: Status,
    errorMessage?: string,
  ) {
    const threadProgress = this.progress.find(
      (p) => p.originalThread.id === threadId,
    );
    if (threadProgress === undefined) {
      throw new Error(`Could not find thread progress for thread ${threadId}.`);
    }
    threadProgress.status = status;
    threadProgress.errorMessage = errorMessage ?? undefined;
    this.progressModal.setAttribute('progress', JSON.stringify(this.progress));
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
