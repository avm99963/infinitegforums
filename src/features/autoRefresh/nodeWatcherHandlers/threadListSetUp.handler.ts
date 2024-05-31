import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { AutoRefreshNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Sets up the autorefresh list feature.
 */
export default class AutoRefreshThreadListSetUpHandler extends CssSelectorNodeWatcherScriptHandler<AutoRefreshNodeWatcherDependencies> {
  cssSelector = 'ec-thread-list';

  onMutatedNode() {
    this.options.autoRefresh.setUp();
  }
}
