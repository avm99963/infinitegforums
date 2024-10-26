import { Mutex, MutexInterface, withTimeout } from 'async-mutex';

import { getOptions } from '../../../common/options/optionsUtils';
import { OptionCodename, OptionsValues } from '../../../common/options/optionsPrototype';
import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration';
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
    this.setUp();
    return this.mutex.runExclusive(
      () => this.optionsConfiguration.isEnabled(option),
      kReadPriority,
    );
  }

  async getOptionsValues(): Promise<OptionsValues> {
    this.setUp();
    return this.mutex.runExclusive(
      () => this.optionsConfiguration.optionsValues,
      kReadPriority,
    );
  }

  addListener(listener: OptionsChangeListener) {
    this.setUp();
    this.listeners.add(listener);
  }

  private setUp() {
    if (this.isSetUp) return;

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
    const currentOptionsValues = await getOptions(null);
    this.optionsConfiguration = new OptionsConfiguration(currentOptionsValues);

    this.notifyListenersIfApplicable(previousConfiguration);
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
