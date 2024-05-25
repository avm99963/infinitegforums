// Most options are dynamic, which means whenever they are enabled or disabled,
// the effect is immediate. However, some features aren't controlled directly in
// content scripts or injected scripts but instead in the background
// script/service worker.
//
// An example was the "blockdrafts" feature, which when enabled enabled the
// static ruleset blocking *DraftMessages requests.
//
// The "blockdrafts" feature was removed, but this logic has been kept in case
// it is needed in the future.

import {isOptionEnabled} from '../common/options/optionsUtils.js';

// List of features controled in the background:
export var bgFeatures = [];

export function handleBgOptionChange(feature) {
  isOptionEnabled(feature)
      // eslint-disable-next-line no-unused-vars
      .then(enabled => {
        // eslint-disable-next-line no-empty
        switch (feature) {}
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
