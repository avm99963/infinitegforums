import CssSelectorNodeWatcherHandler from '../../../../infrastructure/presentation/nodeWatcher/handlers/CssSelectorHandler.adapter';
import AutoRefresh from '../../core/autoRefresh';

/**
 * Sets up the autorefresh list feature.
 */
export default class AutoRefreshThreadListSetUpHandler extends CssSelectorNodeWatcherHandler {
  cssSelector = 'ec-thread-list';

  constructor(private autoRefresh: AutoRefresh) {
    super();
  }

  onMutatedNode() {
    this.autoRefresh.setUp();
  }
}
