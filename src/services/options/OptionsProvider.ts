import { OptionsConfiguration } from '../../common/options/OptionsConfiguration';
import {
  OptionCodename,
  OptionsValues,
} from '../../common/options/optionsPrototype';

export interface OptionsProviderPort {
  /**
   * Returns the value of option |option|.
   */
  getOptionValue<O extends OptionCodename>(
    option: O,
  ): Promise<OptionsValues[O]>;

  /**
   * Returns whether |feature| is enabled.
   */
  isEnabled(option: OptionCodename): Promise<boolean>;

  getOptionsValues(): Promise<OptionsValues>;

  /**
   * Adds a listener for changes in the options configuration.
   */
  addListener(listener: OptionsChangeListener): void;
}

export type OptionsChangeListener = (
  previousOptionValues: OptionsConfiguration,
  currentOptionValues: OptionsConfiguration,
) => void;
