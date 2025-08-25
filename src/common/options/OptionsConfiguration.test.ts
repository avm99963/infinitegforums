import {
  OptionsConfiguration,
  OptionsStatus,
  OptionStatus,
} from './OptionsConfiguration';
import { describe, expect, it } from 'vitest';
import { options, OptionCodename } from './optionsPrototype';

function buildDummyOptionsStatus(
  override: Partial<OptionsStatus>,
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

describe('OptionsConfiguration', () => {
  describe('isEnabled', () => {
    // Internal options with boolean values such as |ccdarktheme_switch_status|
    // should have their value correctly returned by the isEnabled method.
    it('should return true for an enabled option which is marked as KillSwitchType.Ignore', () => {
      const optionsStatus = buildDummyOptionsStatus({
        ccdarktheme_switch_status: {
          value: true,
          isKillSwitchEnabled: false,
        },
      });

      const sut = new OptionsConfiguration(optionsStatus);
      const result = sut.isEnabled('ccdarktheme_switch_status');

      expect(result).toBe(true);
    });
  });
});
