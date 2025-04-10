import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { batchLock } from '../../core/batchLock';

/**
 * Injects the batch lock button in the thread list if the option is
 * currently enabled.
 */
export default class BatchLockBulkActionsHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    'ec-bulk-actions material-button:is([debugid="mark-read-button"], [debugid="mark-unread-button"])';

  async onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) return;

    batchLock.addButtonIfEnabled(node);
  }
}
