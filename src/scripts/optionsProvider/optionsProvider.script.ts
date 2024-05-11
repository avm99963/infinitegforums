import { Dependency, OptionsProviderDependency } from "../../common/architecture/dependenciesProvider/DependenciesProvider";
import { ScriptEnvironment, ScriptPage, ScriptRunPhase } from "../../common/architecture/scripts/Script";
import SetUpDependenciesScript from "../../common/architecture/scripts/setUpDependencies/SetUpDependenciesScript";

export default class OptionsProviderSetUpScript extends SetUpDependenciesScript {
  public priority = 99;
  public page = ScriptPage.CommunityConsole;
  public environment = ScriptEnvironment.ContentScript;
  public runPhase = ScriptRunPhase.Start;
  public dependencies: Dependency[] = [OptionsProviderDependency];
}
