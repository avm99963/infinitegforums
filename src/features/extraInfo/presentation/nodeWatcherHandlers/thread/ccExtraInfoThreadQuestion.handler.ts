import CssSelectorNodeWatcherHandler from '../../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../../presentation/nodeWatcher/NodeWatcherHandler';
import ExtraInfo from '../../../core';

/** Inject extra info in questions. */
export default class CCExtraInfoThreadQuestionHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    'sc-tailwind-thread-question-question-card sc-tailwind-thread-question-state-chips';

  constructor(private extraInfo: ExtraInfo) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.extraInfo.injectAtQuestionIfEnabled(node);
  }
}
