import CssSelectorNodeWatcherScriptHandler from '../../../common/architecture/scripts/nodeWatcher/handlers/CssSelectorNodeWatcherScriptHandler';
import { NodeMutation } from '../../../common/nodeWatcher/NodeWatcherHandler';
import { AutoRefreshNodeWatcherDependencies } from '../scripts/nodeWatcher.script';

/**
 * Sets up the autorefresh list feature.
 */
export default class AutoRefreshThreadListSetUpHandler extends CssSelectorNodeWatcherScriptHandler<AutoRefreshNodeWatcherDependencies> {
  cssSelector = 'ec-thread-list';

  onMutatedNode(_: NodeMutation) {
    this.options.autoRefresh.setUp();
  }
}
