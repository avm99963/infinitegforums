import ThreadToolbar from '../../core/threadToolbar';
import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';

/* Inject thread toolbar. */
export default class ThreadToolbarInjectHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-thread .scTailwindThreadThreadcontentreplies-section';

  constructor(private threadToolbar: ThreadToolbar) {
    super();
  }

  onMutatedNode({ node }: NodeMutation<HTMLElement>) {
    this.threadToolbar.injectIfApplicable(node);
  }
}
