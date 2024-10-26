import {
  NodeMutation,
  NodeWatcherHandler,
} from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import Workflows from '../../core/communityConsole/workflows';

/**
 * Injects the workflows menu in the thread list.
 */
export default class WorkflowsThreadListActionBarHandler
  implements NodeWatcherHandler
{
  initialDiscoverySelector =
    ':is(ec-bulk-actions material-button[debugid="mark-read-button"],' +
    'ec-bulk-actions material-button[debugid="mark-unread-button"])';

  constructor(private workflows: Workflows) {}

  nodeFilter(mutation: NodeMutation) {
    return this.workflows.shouldAddThreadListBtn(mutation.node);
  }

  onMutatedNode(mutation: NodeMutation) {
    this.workflows.addThreadListBtnIfEnabled(mutation.node);
  }
}
