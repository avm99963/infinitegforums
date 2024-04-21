import DependenciesProviderSingleton, {
  AutoRefreshDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import NodeWatcherScript from '../../../common/architecture/scripts/nodeWatcher/NodeWatcherScript';
import AutoRefresh from '../core/autoRefresh';
import AutoRefreshThreadListHideHandler from '../nodeWatcherHandlers/threadListHide.handler';
import AutoRefreshThreadListSetUpHandler from '../nodeWatcherHandlers/threadListSetUp.handler';

export interface AutoRefreshNodeWatcherDependencies {
  autoRefresh: AutoRefresh;
}

export default class AutoRefreshNodeWatcherScript extends NodeWatcherScript<AutoRefreshNodeWatcherDependencies> {
  public page = ScriptPage.CommunityConsole;
  public environment = ScriptEnvironment.ContentScript;
  public runPhase = ScriptRunPhase.Main;
  public handlers = new Map([
    ['autoRefreshThreadListSetUp', AutoRefreshThreadListSetUpHandler],
    ['autoRefreshThreadListHide', AutoRefreshThreadListHideHandler],
  ]);

  protected optionsFactory(): AutoRefreshNodeWatcherDependencies {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    return {
      autoRefresh: dependenciesProvider.getDependency(AutoRefreshDependency),
    };
  }
}
