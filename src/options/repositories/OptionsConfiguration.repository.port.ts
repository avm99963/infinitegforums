import { OptionsConfiguration } from '../../common/options/OptionsConfiguration';

export interface OptionsConfigurationRepositoryPort {
  /** Get an up to date options configuration. */
  get(): Promise<OptionsConfiguration>;

  /** Add a listener that is called when the options configuration changes. */
  addListener(
    listener: OptionsConfigurationChangeListener,
  ): Promise<void> | void;
}

export type OptionsConfigurationChangeListener = (
  previousConfiguration: OptionsConfiguration,
  currentConfiguration: OptionsConfiguration,
) => void;
