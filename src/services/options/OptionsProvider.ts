import { OptionsConfiguration } from '../../common/options/OptionsConfiguration';
import {
  OptionCodename,
  OptionsValues,
} from '../../common/options/optionsPrototype';

/**
 * Class which provides option values and a way to listen to option changes.
 */
export interface OptionsProviderPort {
  /**
   * Returns the raw value of option |option| as configured by the user, that
   * is, **without** taking into account kill switches.
   */
  getOptionValue<O extends OptionCodename>(
    option: O,
  ): Promise<OptionsValues[O]>;

  /**
   * Returns whether |feature| is enabled, taking into account any enabled kill
   * switches.
   */
  isEnabled(option: OptionCodename): Promise<boolean>;

  /**
   * Get options configuration object.
   */
  getOptionsConfiguration(): Promise<OptionsConfiguration>;

  /**
   * Get option values, taking into account any enabled kill switches.
   * @deprecated - Use the options configuration object methods or the options
   * provider methods. This method has been deprecated because
   * OptionsConfiguration will/has been changed to not use OptionsValues, since
   * we also need to store additional information such as if a kill switch is
   * enabled.
   */
  getOptionsValues(): Promise<OptionsValues>;

  /**
   * Adds a listener for changes in the options configuration.
   */
  addListener(listener: OptionsChangeListener): void;
}

export type OptionsChangeListener = (
  previousConfiguration: OptionsConfiguration,
  currentConfiguration: OptionsConfiguration,
) => void;
