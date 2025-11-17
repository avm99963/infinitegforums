import {compareLoose} from 'semver';

import actionApi from '../common/actionApi.js';
import {getSemVerExtVersion} from '../common/extUtils.js';

import * as commonPb from './api_proto/common_pb.js';
import {KillSwitchServicePromiseClient} from './api_proto/kill_switch_grpc_web_pb.js';
import * as ksPb from './api_proto/kill_switch_pb.js';
import {KILL_SWITCH_HOST} from './config.js';

const KILLSWITCH_BADGE_OPTIONS = {
  'iconTitleI18nKey': 'actionbadge_killswitch_enabled',
  'badgeText': '!',
  'bgColor': '#B71C1C',
};

export default class KillSwitchMechanism {
  constructor() {
    this.client =
        new KillSwitchServicePromiseClient(KILL_SWITCH_HOST, null, null);
  }

  setBadge(anyKillSwitchEnabled) {
    if (anyKillSwitchEnabled) {
      actionApi.setBadgeBackgroundColor(
          {color: KILLSWITCH_BADGE_OPTIONS.bgColor});
      actionApi.setBadgeText({text: KILLSWITCH_BADGE_OPTIONS.badgeText});
      let title =
          chrome.i18n.getMessage(KILLSWITCH_BADGE_OPTIONS.iconTitleI18nKey);
      actionApi.setTitle({title});
    } else {
      actionApi.setBadgeText({text: ''});
      actionApi.setTitle({title: ''});
    }
  }

  getCurrentBrowser() {
    // #!if defined(GECKO)
    return commonPb.Environment.Browser.BROWSER_GECKO;
    // #!else
    return commonPb.Environment.Browser.BROWSER_CHROMIUM;
    // #!endif
  }

  updateKillSwitchStatus() {
    let request = new ksPb.GetKillSwitchOverviewRequest();
    request.setWithNonactiveKillSwitches(false);

    this.client.getKillSwitchOverview(request)
        .then(res => {
          let killSwitches = res.getKillSwitchesList();
          let currentVersion = getSemVerExtVersion();
          if (currentVersion === '0' || currentVersion === null) {
            currentVersion = '0.0.0';
          }

          let forceDisabledFeaturesSet = new Set();
          for (let killSwitch of killSwitches) {
            // If it isn't active, this kill switch is not applicable.
            if (!killSwitch.getActive()) continue;

            // If min_version is set and is greater than the current version,
            // this kill switch is not applicable.
            if (killSwitch.getMinVersion() != '' &&
                compareLoose(killSwitch.getMinVersion(), currentVersion) == 1)
              continue;

            // If max_version is set and is less than the current version, this
            // kill switch is not applicable.
            if (killSwitch.getMaxVersion() != '' &&
                compareLoose(killSwitch.getMaxVersion(), currentVersion) == -1)
              continue;

            let browsers = killSwitch.getBrowsersList();
            let currentBrowser = this.getCurrentBrowser();

            // If this browser isn't included as part of the kill switch, the
            // kill switch is not applicable.
            if (!browsers.includes(currentBrowser)) continue;

            console.warn(
                'Kill switch ' + killSwitch.getId() + ' will be applied!');

            let featureCodename = killSwitch.getFeature()?.getCodename?.();
            if (featureCodename) forceDisabledFeaturesSet.add(featureCodename);
          }

          let forceDisabledFeatures = Array.from(forceDisabledFeaturesSet);

          chrome.storage.sync.set(
              {_forceDisabledFeatures: forceDisabledFeatures}, () => {
                let anyKillSwitchEnabled = forceDisabledFeatures.length > 0;
                this.setBadge(anyKillSwitchEnabled);
              });
        })
        .catch(err => {
          console.error(
              '[killSwitch] Can\'t retrieve kill switch status: ', err);
        });
  }
}
