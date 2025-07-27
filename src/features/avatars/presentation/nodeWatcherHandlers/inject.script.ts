import AvatarsHandler from '../../core/avatars';
import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';

/** Inject avatars to threads in the thread list. */
export default class AvatarsInjectHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'li:has(ec-thread-summary)';

  constructor(private avatarsHandler: AvatarsHandler) {
    super();
  }

  onMutatedNode({ node }: NodeMutation<HTMLElement>) {
    this.avatarsHandler.injectIfEnabled(node);
  }
}
