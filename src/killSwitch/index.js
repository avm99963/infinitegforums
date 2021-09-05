import {compareLoose} from 'semver';

import {getExtVersion, isFirefox} from '../common/extUtils.js';

import * as commonPb from './api_proto/common_pb.js';
import {KillSwitchServicePromiseClient} from './api_proto/kill_switch_grpc_web_pb.js';
import * as ksPb from './api_proto/kill_switch_pb.js';

const host =
    (PRODUCTION ? 'https://twpt-grpc-web.avm99963.com/' :
                  'http://localhost:8081');

export default class KillSwitchMechanism {
  constructor() {
    this.client = new KillSwitchServicePromiseClient(host, null, null);
  }

  getCurrentBrowser() {
    if (isFirefox()) return commonPb.Environment.Browser.BROWSER_GECKO;
    return commonPb.Environment.Browser.BROWSER_CHROMIUM;
  }

  updateKillSwitchStatus() {
    let request = new ksPb.GetKillSwitchOverviewRequest();
    request.setWithNonactiveKillSwitches(false);

    this.client.getKillSwitchOverview(request)
        .then(res => {
          let killSwitches = res.getKillSwitchesList();
          let currentVersion = getExtVersion();
          if (currentVersion === '0') currentVersion = '0.0.0';

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
                if (forceDisabledFeatures.length > 0) {
                  // TODO(avm99963): show a badge to warn that some features
                  // have been force disabled.
                }
              });
        })
        .catch(err => {
          console.error(
              '[killSwitch] Can\'t retrieve kill switch status: ', err);
        });
  }
};
