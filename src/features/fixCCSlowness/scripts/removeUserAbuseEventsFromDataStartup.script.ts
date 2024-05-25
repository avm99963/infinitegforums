import DependenciesProviderSingleton, {
  OptionsProviderDependency,
  StartupDataStorageDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';

export default class RemoveUserAbuseEventsFromDataStartupScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  async execute() {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    const optionsProvider = dependenciesProvider.getDependency(
      OptionsProviderDependency,
    );
    if (optionsProvider.isEnabled('fixpekb269560789')) {
      const startupDataStorage = dependenciesProvider.getDependency(
        StartupDataStorageDependency,
      );
      startupDataStorage.enqueueModification((startupDataModel) => {
        if (startupDataModel.data[1]?.[1]?.[8]?.[7]) {
          delete startupDataModel.data[1]?.[1]?.[8]?.[7];
        }
      });
    }
  }
}
