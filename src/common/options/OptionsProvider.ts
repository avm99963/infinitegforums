import { Mutex, MutexInterface, withTimeout } from 'async-mutex';

import { getOptions } from './optionsUtils';
import { OptionCodename, OptionsValues } from './optionsPrototype';
import { OptionsConfiguration } from './OptionsConfiguration';

// Prioritize reads before writes.
const kReadPriority = 10;
const kWritePriority = 0;

/**
 * Class which provides option values and a way to listen to option changes.
 */
export default class OptionsProvider {
  private optionsConfiguration: OptionsConfiguration;
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);
  private listeners: Set<OptionsChangeListener> = new Set();

  constructor() {
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

  /**
   * Returns the value of option |option|.
   */
  async getOptionValue<O extends OptionCodename>(
    option: O,
  ): Promise<OptionsValues[O]> {
    return this.mutex.runExclusive(
      () => this.optionsConfiguration.getOptionValue(option),
      kReadPriority,
    );
  }

  /**
   * Returns whether |feature| is enabled.
   */
  async isEnabled(option: OptionCodename): Promise<boolean> {
    return this.mutex.runExclusive(
      () => this.optionsConfiguration.isEnabled(option),
      kReadPriority,
    );
  }

  async getOptionsValues(): Promise<OptionsValues> {
    return this.mutex.runExclusive(
      () => this.optionsConfiguration.optionsValues,
      kReadPriority,
    );
  }

  /**
   * Adds a listener for changes in the options configuration.
   */
  addListener(listener: OptionsChangeListener) {
    this.listeners.add(listener);
  }
}

export type OptionsChangeListener = (
  previousOptionValues: OptionsConfiguration,
  currentOptionValues: OptionsConfiguration,
) => void;
