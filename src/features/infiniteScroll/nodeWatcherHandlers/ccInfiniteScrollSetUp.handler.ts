import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { InfiniteScrollNodeWatcherOptions } from '../scripts/ccInfiniteScroll.script';

export default class CCInfiniteScrollSetUpHandler extends CssSelectorNodeWatcherScriptHandler<InfiniteScrollNodeWatcherOptions> {
  cssSelector = 'ec-app, .scrollable-content';

  onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) return;
    const isScrollableContent = node.classList.contains('scrollable-content');
    this.options.ccInfiniteScroll.setUpIntersectionObserver(
      node,
      isScrollableContent,
    );
  }
}
