import DependenciesProviderSingleton, {
  WorkflowsDependency,
  WorkflowsImportDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import NodeWatcherScript from '../../../common/architecture/scripts/nodeWatcher/NodeWatcherScript';
import WorkflowsImport from '../core/communityConsole/import';
import Workflows from '../core/communityConsole/workflows';
import WorkflowsImportCRTagsHandler from '../nodeWatcherHandlers/crTags.handler';
import WorkflowsThreadListActionBarHandler from '../nodeWatcherHandlers/threadListActionBar.handler';

export interface WorkflowsNodeWatcherDependencies {
  workflows: Workflows;
  workflowsImport: WorkflowsImport;
}

export default class WorkflowsNodeWatcherScript extends NodeWatcherScript<WorkflowsNodeWatcherDependencies> {
  public page = ScriptPage.CommunityConsole;
  public environment = ScriptEnvironment.ContentScript;
  public runPhase = ScriptRunPhase.Main;
  public handlers = new Map([
    ['workflowsImportCRTags', WorkflowsImportCRTagsHandler],
    ['workflowsThreadListActionBar', WorkflowsThreadListActionBarHandler],
  ]);

  protected optionsFactory(): WorkflowsNodeWatcherDependencies {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    return {
      workflows: dependenciesProvider.getDependency(WorkflowsDependency),
      workflowsImport: dependenciesProvider.getDependency(
        WorkflowsImportDependency,
      ),
    };
  }
}
