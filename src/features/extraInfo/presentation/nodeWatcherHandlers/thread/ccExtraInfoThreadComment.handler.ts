import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject extra info in comments. */
export default class CCExtraInfoThreadCommentHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    'sc-tailwind-thread-message-message-list sc-tailwind-thread-message-comment-card';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectAtCommentIfEnabled(node);
  }
}
