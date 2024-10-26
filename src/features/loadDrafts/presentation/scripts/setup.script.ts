import Script from '../../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../../services/communityConsole/StartupDataStorage.port';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

export default class LoadDraftsSetupScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private optionsProvider: OptionsProviderPort,
    private startupDataStorage: StartupDataStoragePort,
  ) {
    super();
  }

  async execute() {
    if (await this.optionsProvider.isEnabled('loaddrafts')) {
      this.startupDataStorage.enqueueModification((startupDataModel) => {
        startupDataModel.data[4][13] = true;
      });
      // NOTE: Workaround because otherwise the modifications would be applied too late.
      this.startupDataStorage.applyModifications();
    }
  }
}
