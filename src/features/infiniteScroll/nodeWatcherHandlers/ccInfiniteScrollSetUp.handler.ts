import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherHandler from '../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import CCInfiniteScroll from '../core/ccInfiniteScroll';

export default class CCInfiniteScrollSetUpHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-app, .scrollable-content';

  constructor(private ccInfiniteScroll: CCInfiniteScroll) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) return;
    const isScrollableContent = node.classList.contains('scrollable-content');
    this.ccInfiniteScroll.setUpIntersectionObserver(node, isScrollableContent);
  }
}
