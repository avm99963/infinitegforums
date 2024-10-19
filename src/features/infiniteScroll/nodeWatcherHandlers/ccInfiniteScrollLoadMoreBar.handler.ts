import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { InfiniteScrollNodeWatcherOptions } from '../scripts/ccInfiniteScroll.script';

export default class CCInfiniteScrollLoadMoreBarHandler extends CssSelectorNodeWatcherScriptHandler<InfiniteScrollNodeWatcherOptions> {
  cssSelector = '.load-more-bar';

  onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) {
      console.error(
        '[CCInfiniteScrollLoadMoreBarHandler] Node is not an Element: ',
        node,
      );
      return;
    }
    this.options.ccInfiniteScroll.observeLoadMoreBar(node);
  }
}
