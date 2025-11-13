// #!if defined(MV3)
import XMLHttpRequest from 'sw-xhr';
// #!endif

import actionApi from '../common/actionApi.js';
import {cleanUpOptions} from '../common/options/optionsUtils.js';
import KillSwitchMechanism from '../killSwitch/index.js';
import {handleBgOptionChange, handleBgOptionsOnStart} from '../options/bgHandler/bgHandler.js';
import UpdateNotifier from '../updateNotifier/presentation/bg/index.js';

// #!if defined(MV3)
// XMLHttpRequest is not present in service workers (MV3) and is required by the
// grpc-web package. Importing a shim to work around this.
// https://github.com/grpc/grpc-web/issues/1134
self.XMLHttpRequest = XMLHttpRequest;
// #!endif

// Returns whether the script is being ran when the extension starts up. It does
// so on a best-effort-basis.
function isExtensionStartup() {
  // If chrome.storage.session isn't implemented in this version of Chrome, we
  // don't know whether it's the extension startup.
  if (!chrome.storage.session) return Promise.resolve(true);

  return new Promise(resolve => {
    return chrome.storage.session.get('hasAlreadyStarted', v => {
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

actionApi.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

const killSwitchMechanism = new KillSwitchMechanism();

chrome.alarms.get('updateKillSwitchStatus', alarm => {
  if (!alarm)
    chrome.alarms.create('updateKillSwitchStatus', {
      periodInMinutes: PRODUCTION ? 30 : 1,
    });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'updateKillSwitchStatus')
    killSwitchMechanism.updateKillSwitchStatus();
});

// When the profile is first started, update the kill switch status.
chrome.runtime.onStartup.addListener(() => {
  killSwitchMechanism.updateKillSwitchStatus();
});

// When the extension is first installed or gets updated, set new options to
// their default value, update the kill switch status and prompt the user to
// refresh the Community Console page.
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install' || details.reason == 'update') {
    chrome.storage.sync.get(null, options => {
      cleanUpOptions(options, false);
    });

    killSwitchMechanism.updateKillSwitchStatus();

    const updateNotifier = new UpdateNotifier();
    updateNotifier.notify(details.reason);
  }
});

// Clean up optional permissions and check that none are missing for enabled
// features, and also handle background option changes as soon as the extension
// starts and when the options change.
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return;

  for (let [key] of Object.entries(changes)) {
    handleBgOptionChange(key);
  }
});

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (sender.id !== chrome.runtime.id)
    return console.warn(
        'An unknown sender (' + sender.id +
            ') sent a message to the extension: ',
        msg);

  console.assert(msg.message);
  switch (msg.message) {
    case 'openWorkflowsManager':
      chrome.tabs.create({
        url: chrome.runtime.getURL('workflows.html'),
      });
      break;

    default:
      console.warn('Unknown message "' + msg.message + '".');
  }
});

// This should only run once when the extension starts up.
isExtensionStartup().then(isStartup => {
  if (isStartup) {
    handleBgOptionsOnStart();
    setHasAlreadyStarted();
  }
});
