import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject extra info in the toolbelt of an expanded thread list item. */
export default class CCExtraInfoThreadListToolbeltHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-thread-summary .main .toolbelt';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectAtExpandedThreadListIfEnabled(node);
  }
}
