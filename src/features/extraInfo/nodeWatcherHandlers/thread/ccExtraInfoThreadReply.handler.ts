import CssSelectorNodeWatcherScriptHandler from '../../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { CCExtraInfoMainOptions } from '../../scripts/ccExtraInfoMain.script';

/**
 * Inject extra info to threads in the thread list.
 */
export default class CCExtraInfoThreadReplyHandler extends CssSelectorNodeWatcherScriptHandler<CCExtraInfoMainOptions> {
  cssSelector = 'sc-tailwind-thread-message-message-list sc-tailwind-thread-message-message-card';

  onMutatedNode({ node }: NodeMutation) {
    this.options.extraInfo.injectAtReplyIfEnabled(node);
  }
}
