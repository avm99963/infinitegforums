import CssSelectorNodeWatcherScriptHandler from '../../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import { CCExtraInfoMainOptions } from '../../scripts/ccExtraInfoMain.script';

/**
 * Inject extra info to threads in the thread list.
 */
export default class CCExtraInfoThreadListHandler extends CssSelectorNodeWatcherScriptHandler<CCExtraInfoMainOptions> {
  cssSelector = 'li:has(ec-thread-summary)';

  onMutatedNode({ node }: NodeMutation) {
    this.options.extraInfo.injectAtThreadListIfEnabled(node);
  }
}
