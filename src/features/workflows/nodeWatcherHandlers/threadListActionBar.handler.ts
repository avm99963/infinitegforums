import { NodeWatcherScriptHandler } from '../../../common/architecture/scripts/nodeWatcher/handlers/NodeWatcherScriptHandler';
import { NodeMutation } from '../../../common/nodeWatcher/NodeWatcherHandler';
import { WorkflowsNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Injects the workflows menu in the thread list.
 */
export default class WorkflowsThreadListActionBarHandler extends NodeWatcherScriptHandler<WorkflowsNodeWatcherDependencies> {
  initialDiscoverySelector =
    ':is(ec-bulk-actions material-button[debugid="mark-read-button"],' +
    'ec-bulk-actions material-button[debugid="mark-unread-button"])';

  nodeFilter(mutation: NodeMutation) {
    return this.options.workflows.shouldAddThreadListBtn(mutation.node);
  }

  onMutatedNode(mutation: NodeMutation) {
    this.options.workflows.addThreadListBtnIfEnabled(mutation.node);
  }
}
