import { OptionsModifierAdapter } from '@/infrastructure/services/options/OptionsModifier.adapter.js';
import OptionsProviderAdapter from '@/infrastructure/services/options/OptionsProvider.adapter.js';
import { BgHandler } from '@/options/bgHandler/bgHandler';
import { OptionsConfigurationRepositoryAdapter } from '@/options/infrastructure/repositories/OptionsConfiguration.repository.adapter.js';
import { DefaultOptionsCommitterAdapter } from '@/options/infrastructure/services/DefaultOptionsCommitter.service.adapter.js';
import { getSyncStorageAreaRepository } from '@/storage/compositionRoot/index.js';
import { PERFORM_MIGRATION_MESSAGE_NAME } from '@/storage/infrastructure/services/syncStorageMigratorProxyToBg.js';
// #!if defined(MV3)
import XMLHttpRequest from '@avm99963/sw-xhr';
// #!endif

import actionApi from '../common/actionApi.js';
// #!if defined(ENABLE_KILL_SWITCH_MECHANISM)
import KillSwitchMechanism from '../killSwitch/index.js';
// #!endif
import { SyncStorageMigratorAdapter } from '../storage/infrastructure/services/syncStorageMigrator.adapter.js';
import sortedMigrations from '../storage/migrations/index.js';
import {
  getDefaultStorage,
  LATEST_SCHEMA_VERSION,
} from '../storage/schemas/index.js';
import UpdateNotifier from '../updateNotifier/presentation/bg/index.js';

// #!if defined(MV3)
// XMLHttpRequest is not present in service workers (MV3) and is required by the
// grpc-web package. Importing a shim to work around this.
// https://github.com/grpc/grpc-web/issues/1134
self.XMLHttpRequest = XMLHttpRequest as unknown as typeof self.XMLHttpRequest;
// #!endif

// Returns whether the script is being ran when the extension starts up. It does
// so on a best-effort-basis.
function isExtensionStartup() {
  // If chrome.storage.session isn't implemented in this version of Chrome, we
  // don't know whether it's the extension startup.
  if (!chrome.storage.session) return Promise.resolve(true);

  return new Promise((resolve) => {
    return chrome.storage.session.get('hasAlreadyStarted', (v) => {
      resolve(v.hasAlreadyStarted !== true);
    });
  });
}

// Sets that the extension has already started up
function setHasAlreadyStarted() {
  if (!chrome.storage.session) return;
  chrome.storage.session.set({
    hasAlreadyStarted: true,
  });
}

const storageMigrator = new SyncStorageMigratorAdapter(
  sortedMigrations,
  LATEST_SCHEMA_VERSION,
  getDefaultStorage,
);

const syncStorageAreaRepository = getSyncStorageAreaRepository(storageMigrator);

const optionsConfigurationRepository =
  new OptionsConfigurationRepositoryAdapter(syncStorageAreaRepository);
const optionsProvider = new OptionsProviderAdapter(
  optionsConfigurationRepository,
);
const optionsModifier = new OptionsModifierAdapter(syncStorageAreaRepository);

const bgHandler = new BgHandler(optionsProvider);

const defaultOptionsCommitter = new DefaultOptionsCommitterAdapter(
  optionsProvider,
  optionsModifier,
);

actionApi.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// #!if defined(ENABLE_KILL_SWITCH_MECHANISM)
const killSwitchMechanism = new KillSwitchMechanism(syncStorageAreaRepository);
killSwitchMechanism.updateBadge();

let KILL_SWITCH_UPDATE_PERIOD_IN_MINUTES: number;
// #!if defined(PRODUCTION)
KILL_SWITCH_UPDATE_PERIOD_IN_MINUTES = 30;
// #!else
KILL_SWITCH_UPDATE_PERIOD_IN_MINUTES = 1;
// #!endif

chrome.alarms.get('updateKillSwitchStatus', (alarm) => {
  if (!alarm)
    chrome.alarms.create('updateKillSwitchStatus', {
      periodInMinutes: KILL_SWITCH_UPDATE_PERIOD_IN_MINUTES,
    });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateKillSwitchStatus')
    killSwitchMechanism.updateKillSwitchStatus();
});

// When the profile is first started, update the kill switch status.
chrome.runtime.onStartup.addListener(() => {
  killSwitchMechanism.updateKillSwitchStatus();
});
// #!endif

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == 'install' || details.reason == 'update') {
    // Running the migration preemptively.
    storageMigrator.migrate();

    defaultOptionsCommitter.commit();

    // #!if defined(ENABLE_KILL_SWITCH_MECHANISM)
    killSwitchMechanism.updateKillSwitchStatus();
    // #!endif

    const updateNotifier = new UpdateNotifier();
    updateNotifier.notify(details.reason);
  }
});

// Clean up optional permissions and check that none are missing for enabled
// features, and also handle background option changes as soon as the extension
// starts and when the options change.
chrome.storage.onChanged.addListener((_, areaName) => {
  if (areaName !== 'sync') return;

  bgHandler.handlePossibleOptionsChange();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id)
    return console.warn(
      'An unknown sender (' + sender.id + ') sent a message to the extension: ',
      msg,
    );

  console.assert(msg.message);
  switch (msg.message) {
    case 'openWorkflowsManager':
      chrome.tabs.create({
        url: chrome.runtime.getURL('workflows.html'),
      });
      break;

    case PERFORM_MIGRATION_MESSAGE_NAME:
      storageMigrator
        .migrate()
        .then(() => {
          sendResponse({});
        })
        .catch((err) => {
          console.error(
            'Error while migrating storage schema (via proxy):',
            err,
          );
          sendResponse({ error: err.message || err.toString() });
        });
      return true;

    default:
      console.warn('Unknown message "' + msg.message + '".');
  }
});

// This should only run once when the extension starts up.
isExtensionStartup().then((isStartup) => {
  if (isStartup) {
    bgHandler.handlePossibleOptionsChange();
    setHasAlreadyStarted();
  }
});
