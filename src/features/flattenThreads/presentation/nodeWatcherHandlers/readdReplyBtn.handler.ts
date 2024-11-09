import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import {
  NodeMutation,
  NodeMutationType,
} from '../../../../presentation/nodeWatcher/NodeWatcherHandler';
import FlattenThreads from '../../core/flattenThreads';

/** Readd reply button when the Community Console removes it */
export default class FlattenThreadsReaddReplyBtnHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'twpt-flatten-thread-reply-button';
  mutationTypesProcessed = [NodeMutationType.RemovedNode];

  constructor(private flattenThreads: FlattenThreads) {
    super();
  }

  onMutatedNode({ node, mutationRecord }: NodeMutation<HTMLElement>) {
    this.flattenThreads.injectReplyBtn(
      mutationRecord.target,
      JSON.parse(node.getAttribute('extraInfo')),
    );
  }
}
