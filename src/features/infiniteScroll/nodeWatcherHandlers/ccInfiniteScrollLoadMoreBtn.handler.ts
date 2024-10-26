import { NodeMutation } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import CssSelectorNodeWatcherHandler from '../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import CCInfiniteScroll from '../core/ccInfiniteScroll';

export default class CCInfiniteScrollLoadMoreBtnHandler extends CssSelectorNodeWatcherHandler {
  cssSelector =
    '.scTailwindThreadMorebuttonbutton, .scTailwindThreadMessagegapbutton';

  constructor(private ccInfiniteScroll: CCInfiniteScroll) {
    super();
  }

  onMutatedNode({ node }: NodeMutation) {
    if (!(node instanceof Element)) {
      console.error(
        '[CCInfiniteScrollLoadMoreBtnHandler] Node is not an Element: ',
        node,
      );
      return;
    }
    this.ccInfiniteScroll.observeLoadMoreInteropBtn(node);
  }
}
