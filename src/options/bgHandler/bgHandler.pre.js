// Most options are dynamic, which means whenever they are enabled or disabled,
// the effect is immediate. However, some features aren't controlled directly in
// content scripts or injected scripts but instead in the background
// script/service worker.
//
// An example is the "blockdrafts" feature, which when enabled should enable the
// static ruleset blocking *DraftMessages requests.

import {isOptionEnabled} from '../../common/options/optionsUtils.js';

// List of features controled in the background:
export var bgFeatures = [
  'blockdrafts',
];

const blockDraftsRuleset = 'blockDrafts';

export function handleBgOptionChange(feature) {
  isOptionEnabled(feature)
      .then(enabled => {
        switch (feature) {
          // #!if defined(MV3)
          case 'blockdrafts':
            chrome.declarativeNetRequest.getEnabledRulesets(rulesets => {
              if (rulesets === undefined) {
                throw new Error(
                    chrome.runtime.lastError.message ??
                    'Unknown error in chrome.declarativeNetRequest.getEnabledRulesets()');
              }

              let isRulesetEnabled = rulesets.includes(blockDraftsRuleset);
              if (!isRulesetEnabled && enabled)
                chrome.declarativeNetRequest.updateEnabledRulesets(
                    {enableRulesetIds: [blockDraftsRuleset]});
              if (isRulesetEnabled && !enabled)
                chrome.declarativeNetRequest.updateEnabledRulesets(
                    {disableRulesetIds: [blockDraftsRuleset]});
            });
            break;
            // #!endif
        }
      })
      .catch(err => {
        console.error(
            'handleBgOptionChange: error while handling feature "' + feature +
                '": ',
            err);
      });
}

export function handleBgOptionsOnStart() {
  for (let feature of bgFeatures) handleBgOptionChange(feature);
}
