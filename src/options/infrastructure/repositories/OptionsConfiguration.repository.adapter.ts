import { Mutex, MutexInterface, withTimeout } from 'async-mutex';
import {
  OptionsConfigurationChangeListener,
  OptionsConfigurationRepositoryPort,
} from '../../repositories/OptionsConfiguration.repository.port';
import {
  OptionsConfiguration,
  OptionsStatus,
} from '../../../common/options/OptionsConfiguration';
import {
  OptionCodename,
  options,
} from '../../../common/options/optionsPrototype';
import { Option } from '@/common/options/Option';
import { SyncStorageAreaRepositoryPort } from '@/storage/repositories/syncStorageAreaRepository.port';

// Prioritize reads before writes of the cached optionsConfiguration.
const kReadPriority = 10;
const kWritePriority = 0;

/**
 * Implementation of the repository of OptionsConfiguration that reads the
 * options from the WebExtension storage via SyncStorageAreaRepositoryPort.
 */
export class OptionsConfigurationRepositoryAdapter implements OptionsConfigurationRepositoryPort {
  private optionsConfiguration: OptionsConfiguration;
  private mutex: MutexInterface = withTimeout(new Mutex(), 60 * 1000);
  private listeners: Set<OptionsConfigurationChangeListener> = new Set();
  private isListening = false;

  constructor(
    private readonly syncStorageAreaRepository: SyncStorageAreaRepositoryPort,
  ) {}

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
    const items = await this.syncStorageAreaRepository.get();
    const entries = options.map((option: Option<unknown>) => {
      return [
        option.codename,
        {
          value: items[option.codename] ?? option.defaultValue,
          isDefaultValue:
            items[option.codename] === undefined ||
            items[option.codename] === null,
          isKillSwitchEnabled: false,
        },
      ] as const;
    });
    const optionsStatus = Object.fromEntries(entries) as OptionsStatus;

    const forceDisabledFeatures = items._forceDisabledFeatures;
    if (Array.isArray(forceDisabledFeatures)) {
      this.addKillSwitchInformation(forceDisabledFeatures, optionsStatus);
    }

    return new OptionsConfiguration(optionsStatus);
  }

  private addKillSwitchInformation(
    forceDisabledFeatures: string[],
    optionsStatus: OptionsStatus,
  ) {
    for (const forceDisabledFeature of forceDisabledFeatures) {
      if (Object.hasOwn(optionsStatus, forceDisabledFeature)) {
        optionsStatus[
          forceDisabledFeature as OptionCodename
        ].isKillSwitchEnabled = true;
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
