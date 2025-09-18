import { OptionsStatus, OptionStatus } from './OptionsConfiguration';
import { OptionCodename, options } from './optionsPrototype';

export function buildDummyOptionsStatus(
  override?: Partial<OptionsStatus>,
): OptionsStatus {
  const defaultOptionsStatus = Object.fromEntries(
    options.map((option) => {
      const optionStatus: OptionStatus<OptionCodename> = {
        value: option.defaultValue,
        isKillSwitchEnabled: false,
      };
      return [option.codename, optionStatus];
    }),
  ) as OptionsStatus;

  return {
    ...defaultOptionsStatus,
    ...override,
  };
}
