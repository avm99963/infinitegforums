import { KillSwitchType } from './Option';
import {
  OptionCodename,
  OptionsValues,
  optionCodenames,
  optionsMap,
} from './optionsPrototype';

export interface OptionStatus<O extends OptionCodename> {
  value: OptionsValues[O];
  /**
   * Whether the value is not user-controlled (it is falling back to the default
   * value).
   */
  isDefaultValue: boolean;
  /**
   * Whether the option has its kill switch enabled.
   */
  isKillSwitchEnabled: boolean;
}

export type OptionsStatus = {
  [O in OptionCodename]: OptionStatus<O>;
};

/**
 * Representation of a specific configuration of the option values.
 */
export class OptionsConfiguration {
  constructor(public optionsStatus: OptionsStatus) {}

  /**
   * Get the option value taking into account any enabled kill switches.
   */
  getOptionValue<O extends OptionCodename>(option: O): OptionsValues[O] {
    if (this.isKillSwitchEnabled(option)) {
      return false as OptionsValues[O];
    }
    return this.getUserConfiguredOptionValue(option);
  }

  /**
   * Returns whether a kill switch is enabled for this option (that is, whether
   * the option has been remotely disabled).
   */
  isKillSwitchEnabled(option: OptionCodename): boolean {
    // Options which are set to ignore kill switches should never have a kill
    // switch active.
    if (optionsMap.get(option).killSwitchType === KillSwitchType.Ignore) {
      return false;
    }

    return this.optionsStatus[option].isKillSwitchEnabled;
  }

  /**
   * Get the option value as configured by the user, **without** taking into
   * account any kill switches.
   */
  getUserConfiguredOptionValue<O extends OptionCodename>(
    option: O,
  ): OptionsValues[O] {
    return this.optionsStatus[option].value;
  }

  /**
   * Returns whether a feature option is enabled, taking into account any
   * enabled kill switch.
   *
   * NOTE: the only admitted options are boolean options.
   */
  isEnabled(option: OptionCodename): boolean {
    return (
      this.getOptionValue(option) === true && !this.isKillSwitchEnabled(option)
    );
  }

  isEqualTo(otherConfiguration: OptionsConfiguration) {
    return optionCodenames.every(
      (option) =>
        this.getUserConfiguredOptionValue(option) ===
          otherConfiguration.getUserConfiguredOptionValue(option) &&
        this.isKillSwitchEnabled(option) ===
          otherConfiguration.isKillSwitchEnabled(option),
    );
  }
}
