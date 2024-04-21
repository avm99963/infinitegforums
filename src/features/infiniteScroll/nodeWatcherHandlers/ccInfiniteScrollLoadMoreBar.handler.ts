import { NodeMutation } from '../../../common/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { InfiniteScrollNodeWatcherOptions } from '../scripts/ccInfiniteScroll.script';

export default class CCInfiniteScrollLoadMoreBarHandler extends CssSelectorNodeWatcherScriptHandler<InfiniteScrollNodeWatcherOptions> {
  cssSelector = '.load-more-bar';

  onMutatedNode({ node }: NodeMutation) {
    this.options.ccInfiniteScroll.observeLoadMoreBar(node);
  }
}
