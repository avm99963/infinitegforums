import { Mutex, MutexInterface, withTimeout } from 'async-mutex';

import {
  OptionCodename,
  optionCodenames,
  OptionsValues,
} from '../../../common/options/optionsPrototype';
import {
  OptionsConfiguration,
  OptionsStatus,
  OptionStatus,
} from '../../../common/options/OptionsConfiguration';
import {
  OptionsChangeListener,
  OptionsProviderPort,
} from '../../../services/options/OptionsProvider';

// Prioritize reads before writes.
const kReadPriority = 10;
const kWritePriority = 0;

/**
 * Class which provides option values and a way to listen to option changes.
 */
export default class OptionsProviderAdapter implements OptionsProviderPort {
  private optionsConfiguration: OptionsConfiguration;
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);
  private listeners: Set<OptionsChangeListener> = new Set();
  private isSetUp = false;

  async getOptionValue<O extends OptionCodename>(
    option: O,
  ): Promise<OptionsValues[O]> {
    this.setUp();
    return this.mutex.runExclusive(
      () => this.optionsConfiguration.getOptionValue(option),
      kReadPriority,
    );
  }

  async isEnabled(option: OptionCodename): Promise<boolean> {
    return (await this.getOptionsConfiguration()).isEnabled(option);
  }

  async getOptionsConfiguration(): Promise<OptionsConfiguration> {
    this.setUp();
    return this.mutex.runExclusive(
      () => this.optionsConfiguration,
      kReadPriority,
    );
  }

  async getOptionsValues(): Promise<OptionsValues> {
    const optionsConfiguration = await this.getOptionsConfiguration();
    const entries = optionCodenames.map((codename) => [
      codename,
      optionsConfiguration.getOptionValue(codename),
    ]);
    return Object.fromEntries(entries) as OptionsValues;
  }

  addListener(listener: OptionsChangeListener) {
    this.setUp();
    this.listeners.add(listener);
  }

  private setUp() {
    if (this.isSetUp) return;

    this.isSetUp = true;
    this.listenForStorageChanges();
    this.updateValues();
  }

  /**
   * Sets up a listener to update the current cached configuration when there
   * are changes to the underlying storage where options are persisted.
   *
   * We could try only doing this only when we're sure it has changed, but
   * there are many factors (if the user has changed it manually, if a kill
   * switch was activated, etc.) so we do it every time there is any change in
   * the underlying storage.
   */
  private listenForStorageChanges() {
    chrome.storage.onChanged.addListener((_, areaName) => {
      if (areaName !== 'sync') return;
      console.debug('[OptionsProvider] Retrieving updated options.');
      this.updateValues();
    });
  }

  private async updateValues() {
    await this.mutex.runExclusive(async () => {
      await this.nonSafeUpdateValues();
    }, kWritePriority);
  }

  private async nonSafeUpdateValues() {
    const previousConfiguration = this.optionsConfiguration;
    this.optionsConfiguration = await this.retrieveOptionsConfiguration();
    this.notifyListenersIfApplicable(previousConfiguration);
  }

  private async retrieveOptionsConfiguration() {
    const options = await chrome.storage.sync.get();
    const entries = optionCodenames.map(
      <O extends OptionCodename>(codename: O): [O, OptionStatus<O>] => [
        codename,
        {
          value: options[codename] as OptionsValues[O],
          isKillSwitchEnabled: false,
        },
      ],
    );
    const optionsStatus = Object.fromEntries(entries) as OptionsStatus;

    const forceDisabledFeatures = options._forceDisabledFeatures;
    if (Array.isArray(forceDisabledFeatures)) {
      this.addKillSwitchInformation(forceDisabledFeatures, optionsStatus);
    }

    return new OptionsConfiguration(optionsStatus);
  }

  private addKillSwitchInformation(
    forceDisabledFeatures: OptionCodename[],
    optionsStatus: OptionsStatus,
  ) {
    for (const forceDisabledFeature of forceDisabledFeatures) {
      if (Object.hasOwn(optionsStatus, forceDisabledFeature)) {
        optionsStatus[forceDisabledFeature].isKillSwitchEnabled = true;
      }
    }
  }

  private async notifyListenersIfApplicable(
    previousOptionsConfiguration: OptionsConfiguration,
  ) {
    if (
      !previousOptionsConfiguration ||
      this.optionsConfiguration.isEqualTo(previousOptionsConfiguration)
    ) {
      return;
    }

    for (const listener of this.listeners) {
      listener(previousOptionsConfiguration, this.optionsConfiguration);
    }
  }
}
