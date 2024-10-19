import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutationType } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import AutoRefresh from '../../core/autoRefresh';

/**
 * Removes the snackbar when exiting thread list view.
 */
export default class AutoRefreshThreadListHideHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-thread-list';

  readonly mutationTypesProcessed: NodeMutationType[] = [
    NodeMutationType.RemovedNode,
  ];

  constructor(private autoRefresh: AutoRefresh) {
    super();
  }

  onMutatedNode() {
    this.autoRefresh.hideUpdatePrompt();
  }
}
