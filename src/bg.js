// #!if browser_target == 'chromium_mv3'
import XMLHttpRequest from 'sw-xhr';
// #!endif

import actionApi from './common/actionApi.js';
import {cleanUpOptPermissions} from './common/optionsPermissions.js';
import {cleanUpOptions, disableItemsWithMissingPermissions} from './common/optionsUtils.js';
import KillSwitchMechanism from './killSwitch/index.js';

// #!if browser_target == 'chromium_mv3'
// XMLHttpRequest is not present in service workers (MV3) and is required by the
// grpc-web package. Importing a shim to work around this.
// https://github.com/grpc/grpc-web/issues/1134
self.XMLHttpRequest = XMLHttpRequest;
// #!endif

actionApi.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

const killSwitchMechanism = new KillSwitchMechanism();

chrome.alarms.create('updateKillSwitchStatus', {
  periodInMinutes: PRODUCTION ? 30 : 1,
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
// their default value and update the kill switch status.
chrome.runtime.onInstalled.addListener(details => {
  if (details.reason == 'install' || details.reason == 'update') {
    chrome.storage.sync.get(null, options => {
      cleanUpOptions(options, false);
    });

    killSwitchMechanism.updateKillSwitchStatus();
  }
});

// Clean up optional permissions and check that none are missing for enabled
// features as soon as the extension starts and when the options change.
cleanUpOptPermissions();

chrome.storage.sync.onChanged.addListener(() => {
  cleanUpOptPermissions();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (sender.id !== chrome.runtime.id)
    return console.warn(
        'An unknown sender (' + sender.id +
            ') sent a message to the extension: ',
        msg);

  console.assert(msg.message);
  switch (msg.message) {
    case 'runDisableItemsWithMissingPermissions':
      console.assert(
          msg.options?.items && msg.options?.permissionChecksFeatures);
      disableItemsWithMissingPermissions(
          msg.options?.items, msg.options?.permissionChecksFeatures)
          .then(items => sendResponse({status: 'resolved', items}))
          .catch(error => sendResponse({status: 'rejected', error}));
      break;

    default:
      console.warn('Unknown message "' + msg.message + '".');
  }
});
