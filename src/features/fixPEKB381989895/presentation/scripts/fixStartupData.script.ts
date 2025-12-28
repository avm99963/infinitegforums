import Script from '../../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../../services/communityConsole/StartupDataStorage.port';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

export default class FixStartupDataScript extends Script {
  priority = 10;
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
    if (await this.optionsProvider.isEnabled('fixpekb381989895')) {
      this.startupDataStorage.enqueueModification((startupDataModel) => {
        // This attemps to delete the
        // forum_data.user.profile_abuse.manual_review_timestamp_micro field.
        if (startupDataModel.data?.[1]?.[1]?.[8]?.[6] !== undefined) {
          delete startupDataModel.data[1][1][8][6];
        }
      });
      // NOTE: Workaround because otherwise the modifications would be applied too late.
      this.startupDataStorage.applyModifications();
    }
  }
}
