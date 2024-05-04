import CssSelectorNodeWatcherScriptHandler from '../../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../../common/nodeWatcher/NodeWatcherHandler';
import { CCExtraInfoMainOptions } from '../../scripts/ccExtraInfoMain.script';

/**
 * Inject extra info to threads in the thread list.
 */
export default class CCExtraInfoThreadQuestionHandler extends CssSelectorNodeWatcherScriptHandler<CCExtraInfoMainOptions> {
  cssSelector = 'sc-tailwind-thread-question-question-card sc-tailwind-thread-question-state-chips';

  onMutatedNode({ node }: NodeMutation) {
    this.options.extraInfo.injectAtQuestionIfEnabled(node);
  }
}
