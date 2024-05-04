import CssSelectorNodeWatcherScriptHandler from '../../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../../common/nodeWatcher/NodeWatcherHandler';
import { CCExtraInfoMainOptions } from '../../scripts/ccExtraInfoMain.script';

/**
 * Inject extra info in the toolbelt of an expanded thread list item.
 */
export default class CCExtraInfoThreadListToolbeltHandler extends CssSelectorNodeWatcherScriptHandler<CCExtraInfoMainOptions> {
  cssSelector = 'ec-thread-summary .main .toolbelt';

  onMutatedNode({ node }: NodeMutation) {
    this.options.extraInfo.injectAtExpandedThreadListIfEnabled(node);
  }
}
