import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import FlattenThreads, {
  kReplyActionButtonsSelector,
} from '../../core/flattenThreads';

/** Inject reply button in non-nested view */
export default class FlattenThreadsReplyBtnHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = kReplyActionButtonsSelector;

  constructor(private flattenThreads: FlattenThreads) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.flattenThreads.injectReplyBtnIfApplicable(node);
  }
}
