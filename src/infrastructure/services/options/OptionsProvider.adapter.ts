import {
  OptionCodename,
  optionCodenames,
  OptionsValues,
} from '../../../common/options/optionsPrototype';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
import {
  OptionsChangeListener,
  OptionsProviderPort,
} from '../../../services/options/OptionsProvider';
import { OptionsConfigurationRepositoryPort } from '../../../options/repositories/OptionsConfiguration.repository.port';

export default class OptionsProviderAdapter implements OptionsProviderPort {
  constructor(private repository: OptionsConfigurationRepositoryPort) {}

  async getOptionValue<O extends OptionCodename>(
    option: O,
  ): Promise<OptionsValues[O]> {
    const optionsConfiguration = await this.getOptionsConfiguration();
    return optionsConfiguration.getOptionValue(option);
  }

  async isEnabled(option: OptionCodename): Promise<boolean> {
    const optionsConfiguration = await this.getOptionsConfiguration();
    return optionsConfiguration.isEnabled(option);
  }

  async getOptionsValues(): Promise<OptionsValues> {
    const optionsConfiguration = await this.getOptionsConfiguration();
    const entries = optionCodenames.map((codename) => [
      codename,
      optionsConfiguration.getOptionValue(codename),
    ]);
    return Object.fromEntries(entries) as OptionsValues;
  }

  getOptionsConfiguration(): Promise<OptionsConfiguration> {
    return this.repository.get();
  }

  addListener(listener: OptionsChangeListener) {
    this.repository.addListener(listener);
  }
}
