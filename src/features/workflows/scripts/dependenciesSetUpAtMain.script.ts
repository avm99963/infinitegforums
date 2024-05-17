import {
  Dependency,
  WorkflowsDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import SetUpDependenciesScript from '../../../common/architecture/scripts/setUpDependencies/SetUpDependenciesScript';

export default class WorkflowsDependenciesSetUpAtMainScript extends SetUpDependenciesScript {
  public page = ScriptPage.CommunityConsole;
  public environment = ScriptEnvironment.ContentScript;
  public runPhase = ScriptRunPhase.Main;
  public dependencies: Dependency[] = [WorkflowsDependency];
}
