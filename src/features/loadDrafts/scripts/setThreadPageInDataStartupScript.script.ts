import DependenciesProviderSingleton, {
  OptionsProviderDependency,
  StartupDataStorageDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';

export default class EnableLoadDraftsFlagInDataStartupScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  async execute() {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    const optionsProvider = dependenciesProvider.getDependency(
      OptionsProviderDependency,
    );
    if (await optionsProvider.isEnabled('loaddrafts')) {
      const startupDataStorage = dependenciesProvider.getDependency(
        StartupDataStorageDependency,
      );
      startupDataStorage.enqueueModification((startupDataModel) => {
        startupDataModel.data[4][13] = true;
      });
      // NOTE: Workaround because otherwise the modifications would be applied too late.
      startupDataStorage.applyModifications();
    }
  }
}
