import { OptionsConfiguration } from './OptionsConfiguration';
import { describe, expect, it } from 'vitest';
import { buildDummyOptionsStatus } from './testUtils';

// NOTE: More tests that cover OptionsConfiguration can be viewed at
// OptionsProvider.test.ts.

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
