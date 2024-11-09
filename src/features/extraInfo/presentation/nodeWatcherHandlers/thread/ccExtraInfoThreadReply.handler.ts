import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject extra info in replies. */
export default class CCExtraInfoThreadReplyHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    'sc-tailwind-thread-message-message-list sc-tailwind-thread-message-message-card';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectAtReplyIfEnabled(node);
  }
}
