import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';

export interface IsBulkReportRepliesFeatureEnabledService {
  isEnabled(configuration: OptionsConfiguration): boolean;
}

export class IsBulkReportRepliesFeatureEnabledServiceAdapter {
  isEnabled(configuration: OptionsConfiguration): boolean {
    return (
      configuration.isEnabled('bulkreportreplies') &&
      configuration.isEnabled('bulkreportreplies_switch_enabled')
    );
  }
}
