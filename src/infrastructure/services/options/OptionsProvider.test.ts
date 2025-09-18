import { describe, it as baseIt, vi, expect, beforeEach } from 'vitest';
import {
  OptionsConfiguration,
  OptionsStatus,
  OptionStatus,
} from '../../../common/options/OptionsConfiguration';
import OptionsProviderAdapter from './OptionsProvider.adapter';
import {
  OptionsConfigurationChangeListener,
  OptionsConfigurationRepositoryPort,
} from '../../../options/repositories/OptionsConfiguration.repository.port';
import { buildDummyOptionsStatus } from '../../../common/options/testUtils';
import {
  OptionCodename,
  optionCodenames,
  optionsPrototype,
} from '../../../common/options/optionsPrototype';
import { KillSwitchType } from '../../../common/options/Option';

const dummyOptionsStatus = buildDummyOptionsStatus();
const dummyOptionsConfiguration = new OptionsConfiguration(dummyOptionsStatus);

const getOptionsConfigurationMock =
  vi.fn<OptionsConfigurationRepositoryPort['get']>();
const addListenerMock =
  vi.fn<OptionsConfigurationRepositoryPort['addListener']>();
class FakeOptionsConfigurationRepositoryAdapter
  implements OptionsConfigurationRepositoryPort
{
  get() {
    return getOptionsConfigurationMock();
  }

  addListener(listener: OptionsConfigurationChangeListener) {
    return addListenerMock(listener);
  }
}

const it = baseIt.extend<{ sut: OptionsProviderAdapter }>({
  sut: async ({}, use) => {
    use(
      new OptionsProviderAdapter(
        new FakeOptionsConfigurationRepositoryAdapter(),
      ),
    );
  },
});

beforeEach(() => {
  vi.resetAllMocks();

  // Sensible defaults
  getOptionsConfigurationMock.mockResolvedValue(dummyOptionsConfiguration);
});

describe('getOptionsConfiguration', () => {
  it('should return the options configuration returned by the underlying repository', async ({
    sut,
  }) => {
    const result = await sut.getOptionsConfiguration();

    expect(result).toEqual(dummyOptionsConfiguration);
  });
});

describe('getOptionValue', () => {
  it('should return the option value behind the underlying repository', async ({
    sut,
  }) => {
    const testOption: OptionCodename = 'ccdarktheme';
    const result = await sut.getOptionValue(testOption);

    expect(result).toEqual(
      dummyOptionsConfiguration.getOptionValue(testOption),
    );
  });
});

describe('isEnabled', () => {
  it.for([
    { expectedResult: true, value: true, isKillSwitchEnabled: false },
    { expectedResult: false, value: false, isKillSwitchEnabled: false },
    { expectedResult: false, value: true, isKillSwitchEnabled: true },
    { expectedResult: false, value: false, isKillSwitchEnabled: true },
  ])(
    'should return $expectedResult when a non-kill-switch-ignored feature is set to $value and isKillSwitchEnabled = $isKillSwitchEnabled',
    async ({ expectedResult, value, isKillSwitchEnabled }, { sut }) => {
      const testOption: OptionCodename = 'ccdarktheme';
      getOptionsConfigurationMock.mockResolvedValue(
        new OptionsConfiguration({
          ...dummyOptionsStatus,
          [testOption]: { value, isKillSwitchEnabled },
        }),
      );

      const result = await sut.isEnabled(testOption);

      expect(result).toEqual(expectedResult);
    },
  );
});

describe('getOptionsValues', () => {
  it('should return an object with the options configured by the user if no kill switch is active', async ({
    sut,
  }) => {
    const expectedResult = Object.fromEntries(
      Object.entries(dummyOptionsStatus).map(([option, optionStatus]) => {
        return [option, optionStatus.value];
      }),
    );

    const result = await sut.getOptionsValues();

    expect(result).toEqual(expectedResult);
  });

  it('should also set false to non-kill-switch-ignored options that have an active kill switch', async ({
    sut,
  }) => {
    const dummyOptionsStatusWithKillSwitches: OptionsStatus =
      Object.fromEntries(
        optionCodenames.map((option) => {
          const { value } = dummyOptionsStatus[option];
          const optionStatus: OptionStatus<OptionCodename> = {
            value: value === false ? true : value,
            isKillSwitchEnabled: true,
          };
          return [option, optionStatus];
        }),
      ) as OptionsStatus;
    getOptionsConfigurationMock.mockResolvedValue(
      new OptionsConfiguration(dummyOptionsStatusWithKillSwitches),
    );
    const expectedResult = Object.fromEntries(
      Object.entries(dummyOptionsStatusWithKillSwitches).map(
        ([option, optionStatus]) => {
          return [
            option,
            optionStatus.isKillSwitchEnabled &&
            optionsPrototype[option].killSwitchType !== KillSwitchType.Ignore
              ? false
              : optionStatus.value,
          ];
        },
      ),
    );

    const result = await sut.getOptionsValues();

    expect(result).toEqual(expectedResult);
  });
});

describe('addListener', () => {
  it('should pass the supplied listener to the repository', ({ sut }) => {
    const listener = () => {};

    sut.addListener(listener);

    expect(addListenerMock).toHaveBeenCalledOnce();
    expect(addListenerMock).toHaveBeenCalledWith(listener);
  });
});
