import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import { NodeMutation } from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import FlattenThreads, {
  kReplyPayloadSelector,
} from '../../core/flattenThreads';

/** Inject parent reply quote */
export default class FlattenThreadsQuoteHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = kReplyPayloadSelector;

  constructor(private flattenThreads: FlattenThreads) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    this.flattenThreads.injectQuoteIfApplicable(node);
  }
}
