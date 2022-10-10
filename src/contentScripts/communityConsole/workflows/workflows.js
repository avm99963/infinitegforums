import {isOptionEnabled} from '../../../common/optionsUtils.js';
import {addElementToThreadListActions, shouldAddBtnToActionBar} from '../utils/common.js';

const wfDebugId = 'twpt-workflows';

export default class Workflows {
  constructor() {}

  addThreadListBtnIfEnabled(readToggle) {
    isOptionEnabled('workflows').then(isEnabled => {
      if (isEnabled) {
        const menu = document.createElement('twpt-workflows-menu');
        addElementToThreadListActions(readToggle, menu);
      }
    });
  }

  shouldAddThreadListBtn(node) {
    return shouldAddBtnToActionBar(wfDebugId, node);
  }
};
