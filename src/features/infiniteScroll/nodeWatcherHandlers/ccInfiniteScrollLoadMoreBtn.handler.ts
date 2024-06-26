import { NodeMutation } from '../../../common/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { InfiniteScrollNodeWatcherOptions } from '../scripts/ccInfiniteScroll.script';

export default class CCInfiniteScrollLoadMoreBtnHandler extends CssSelectorNodeWatcherScriptHandler<InfiniteScrollNodeWatcherOptions> {
  cssSelector =
    '.scTailwindThreadMorebuttonbutton, .scTailwindThreadMessagegapbutton';

  onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) {
      console.error(
        '[CCInfiniteScrollLoadMoreBtnHandler] Node is not an Element: ',
        node,
      );
      return;
    }
    this.options.ccInfiniteScroll.observeLoadMoreInteropBtn(node);
  }
}
