import Script, {
  ConcreteScript,
} from '../../../../common/architecture/scripts/Script';
import ApplyStartupDataModificationsOnMainScript from '../../../../presentation/standaloneScripts/startupDataStorage/applyStartupDataModificationsOnMain.script';
import { StartupDataStoragePort } from '../../../../services/communityConsole/startupDataStorage/StartupDataStorage.port';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';

declare global {
  interface Window {
    startupData: unknown;
  }
}

export default class LogStartupDataScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  runAfter: ConcreteScript[] = [ApplyStartupDataModificationsOnMainScript];

  constructor(
    private optionsProvider: OptionsProviderPort,
    private startupDataStorage: StartupDataStoragePort,
  ) {
    super();
  }

  async execute() {
    if (await this.optionsProvider.isEnabled('logstartupdata')) {
      window.startupData = this.startupDataStorage.get().data;
      console.debug('Startup data: ', window.startupData);
    }
  }
}
