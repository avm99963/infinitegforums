import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject extra info to threads in the thread list. */
export default class CCExtraInfoThreadListHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'li:has(ec-thread-summary)';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectAtThreadListIfEnabled(node);
  }
}
