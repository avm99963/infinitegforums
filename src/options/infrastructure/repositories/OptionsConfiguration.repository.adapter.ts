import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import {
  OptionsConfigurationChangeListener,
  OptionsConfigurationRepositoryPort,
} from '../../repositories/OptionsConfiguration.repository.port';
import {
  OptionsConfiguration,
  OptionsStatus,
  OptionStatus,
} from '../../../common/options/OptionsConfiguration';
import {
  OptionCodename,
  optionCodenames,
  OptionsValues,
} from '../../../common/options/optionsPrototype';

// Prioritize reads before writes of the cached optionsConfiguration.
const kReadPriority = 10;
const kWritePriority = 0;

/**
 * Implementation of the repository of OptionsConfiguration that reads the
 * options from the WebExtension storage via the chrome.storage api.
 */
export class OptionsConfigurationRepositoryAdapter
  implements OptionsConfigurationRepositoryPort
{
  private optionsConfiguration: OptionsConfiguration;
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);
  private listeners: Set<OptionsConfigurationChangeListener> = new Set();
  private isListening = false;

  async get() {
    await this.setUp();
    return this.mutex.runExclusive(
      () => this.optionsConfiguration,
      kReadPriority,
    );
  }

  async addListener(listener: OptionsConfigurationChangeListener) {
    await this.setUp();
    this.listeners.add(listener);
  }

  private async setUp() {
    if (this.isListening) return;

    this.isListening = true;
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
      console.debug(
        '[OptionsConfigurationRepositoryAdapter] Retrieving updated options.',
      );
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
