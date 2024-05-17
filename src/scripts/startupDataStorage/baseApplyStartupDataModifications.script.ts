import DependenciesProviderSingleton, {
  StartupDataStorageDependency,
} from '../../common/architecture/dependenciesProvider/DependenciesProvider';
import Script, {
  ScriptEnvironment,
  ScriptPage,
} from '../../common/architecture/scripts/Script';

/**
 * Base class which applies pending startup data modifications which have been
 * added by other scripts.
 */
export default abstract class BaseApplyStartupDataModificationsScript extends Script {
  priority = 2 ** 32;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;

  execute() {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    const startupDataStoarge = dependenciesProvider.getDependency(
      StartupDataStorageDependency,
    );
    startupDataStoarge.applyModifications();
  }
}
