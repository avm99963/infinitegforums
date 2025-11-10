import Script from '../../../../common/architecture/scripts/Script';
import { OptionsConfiguration } from '../../../../common/options/OptionsConfiguration';
import { OptionsProviderPort } from '../../../../services/options/OptionsProvider';
import { IsBulkReportRepliesFeatureEnabledService } from '../../services/isFeatureEnabled.service';
import { bulkReportRepliesEnabledClassName } from '../consts/consts';

export default class BulkReportRepliesHandleBodyClassScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  constructor(
    private optionsProvider: OptionsProviderPort,
    private isFeatureEnabledService: IsBulkReportRepliesFeatureEnabledService,
  ) {
    super();
  }

  async execute() {
    this.optionsProvider.addListener(
      (_: OptionsConfiguration, currentConf: OptionsConfiguration) =>
        this.updateBodyClass(currentConf),
    );

    this.updateBodyClass(await this.optionsProvider.getOptionsConfiguration());
  }

  private updateBodyClass(currentConf: OptionsConfiguration) {
    if (this.isFeatureEnabledService.isEnabled(currentConf)) {
      document.body?.classList.add(bulkReportRepliesEnabledClassName);
    } else {
      document.body?.classList.remove(bulkReportRepliesEnabledClassName);
    }
  }
}
