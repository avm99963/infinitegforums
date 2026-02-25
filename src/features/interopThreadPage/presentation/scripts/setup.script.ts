import Script from '../../../../common/architecture/scripts/Script';
import { StartupDataStoragePort } from '../../../../services/communityConsole/startupDataStorage/StartupDataStorage.port';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

const SMEI_RCE_THREAD_INTEROP = 22;

export default class InteropThreadPageSetupScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly startupDataStorage: StartupDataStoragePort,
  ) {
    super();
  }

  async execute() {
    if (await this.optionsProvider.isEnabled('interopthreadpage')) {
      const mode = await this.optionsProvider.getOptionValue(
        'interopthreadpage_mode',
      );
      this.startupDataStorage.enqueueModification((startupDataModel) => {
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
      this.startupDataStorage.applyModifications();
    }
  }
}
