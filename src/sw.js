// IMPORTANT: keep this file in sync with background.js
import XMLHttpRequest from 'sw-xhr';

import {cleanUpOptions} from './common/optionsUtils.js';
import KillSwitchMechanism from './killSwitch/index.js';

// XMLHttpRequest is not present in service workers and is required by the
// grpc-web package. Importing a shim to work around this.
// https://github.com/grpc/grpc-web/issues/1134
self.XMLHttpRequest = XMLHttpRequest;

chrome.action.onClicked.addListener(_ => {
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
