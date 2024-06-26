import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutationType } from '../../../common/nodeWatcher/NodeWatcherHandler';
import { AutoRefreshNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Removes the snackbar when exiting thread list view.
 */
export default class AutoRefreshThreadListHideHandler extends CssSelectorNodeWatcherScriptHandler<AutoRefreshNodeWatcherDependencies> {
  cssSelector = 'ec-thread-list';

  readonly mutationTypesProcessed: NodeMutationType[] = [
    NodeMutationType.RemovedNode,
  ];

  onMutatedNode() {
    this.options.autoRefresh.hideUpdatePrompt();
  }
}
