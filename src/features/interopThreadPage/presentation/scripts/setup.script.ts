import DependenciesProviderSingleton, {
  OptionsProviderDependency,
  StartupDataStorageDependency,
} from '../../../../common/architecture/dependenciesProvider/DependenciesProvider';
import Script from '../../../../common/architecture/scripts/Script';

const SMEI_RCE_THREAD_INTEROP = 22;

export default class InteropThreadPageSetupScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  async execute() {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    const optionsProvider = dependenciesProvider.getDependency(
      OptionsProviderDependency,
    );
    if (await optionsProvider.isEnabled('interopthreadpage')) {
      const startupDataStorage = dependenciesProvider.getDependency(
        StartupDataStorageDependency,
      );
      const mode = await optionsProvider.getOptionValue(
        'interopthreadpage_mode',
      );
      startupDataStorage.enqueueModification((startupDataModel) => {
        const index = startupDataModel.data[1][6].indexOf(
          SMEI_RCE_THREAD_INTEROP,
        );

        switch (mode) {
          case 'previous':
            if (index > -1) {
              startupDataModel.data[1][6].splice(index, 1);
            }
            break;

          case 'next':
            if (index == -1) {
              startupDataModel.data[1][6].push(SMEI_RCE_THREAD_INTEROP);
            }
            break;
        }
      });
      // NOTE: Workaround because otherwise the modifications would be applied too late.
      startupDataStorage.applyModifications();
    }
  }
}
