import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherHandler from './CssSelectorHandler.adapter';

export default abstract class CCThreadListBulkActionsNodeWatcherHandler
  extends CssSelectorNodeWatcherHandler
{
  readonly cssSelector =
    'ec-bulk-actions material-button:is([debugid="mark-read-button"], [debugid="mark-unread-button"])';

  async onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) return;

    await this.onCreated(node);
  }

  abstract onCreated(markReadButton: Element): Promise<void>;
}
