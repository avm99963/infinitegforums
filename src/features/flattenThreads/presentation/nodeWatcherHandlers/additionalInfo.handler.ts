import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import FlattenThreads, {
  kAdditionalInfoSelector,
} from '../../core/flattenThreads';

/** Delete additional info in the edit message box */
export default class FlattenThreadsAdditionalInfoHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = kAdditionalInfoSelector;

  constructor(private flattenThreads: FlattenThreads) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.flattenThreads.deleteAdditionalInfoElementIfApplicable(node);
  }
}
