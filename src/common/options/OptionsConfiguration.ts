import {
  OptionCodename,
  OptionsValues,
  optionCodenames,
} from './optionsPrototype';

/**
 * Representation of a specific configuration of the option values.
 */
export class OptionsConfiguration {
  constructor(public optionsValues: OptionsValues) {}

  getOptionValue<O extends OptionCodename>(option: O): OptionsValues[O] {
    return this.optionsValues[option];
  }

  isEnabled(option: OptionCodename): boolean {
    const value = this.getOptionValue(option);
    return value === true;
  }

  isEqualTo(otherConfiguration: OptionsConfiguration) {
    for (const option of optionCodenames) {
      const thisValue = this.getOptionValue(option);
      const otherValue = otherConfiguration.getOptionValue(option);
      if (thisValue !== otherValue) {
        return false;
      }
    }
    return true;
  }
}
