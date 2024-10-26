import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import CCInfiniteScroll from '../core/ccInfiniteScroll';
import CssSelectorNodeWatcherHandler from '../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';

export default class CCInfiniteScrollLoadMoreBarHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = '.load-more-bar';

  constructor(private ccInfiniteScroll: CCInfiniteScroll) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) {
      console.error(
        '[CCInfiniteScrollLoadMoreBarHandler] Node is not an Element: ',
        node,
      );
      return;
    }
    this.ccInfiniteScroll.observeLoadMoreBar(node);
  }
}
