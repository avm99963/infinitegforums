import {createApp} from 'vue';

import {isOptionEnabled} from '../../../common/optionsUtils.js';

import {addButtonToThreadListActions, shouldAddBtnToActionBar} from './../utils/common.js';
import Overlay from './components/Overlay.vue';
import VueMaterialAdapter from './vma.js';

const wfDebugId = 'twpt-workflows';

export default class Workflows {
  constructor() {
    this.overlayApp = null;
    this.overlayVm = null;
  }

  createOverlay() {
    let menuEl = document.createElement('div');
    document.body.appendChild(menuEl);

    this.overlayApp = createApp(Overlay);
    this.overlayApp.use(VueMaterialAdapter);
    this.overlayVm = this.overlayApp.mount(menuEl);
  }

  switchMenu(menuBtn) {
    if (this.overlayApp === null) this.createOverlay();
    if (!this.overlayVm.shown) {
      let rect = menuBtn.getBoundingClientRect();
      this.overlayVm.position = [rect.left + rect.width, rect.bottom];
      this.overlayVm.shown = true;
    } else {
      this.overlayVm.shown = false;
    }
  }

  addThreadListBtnIfEnabled(readToggle) {
    isOptionEnabled('workflows').then(isEnabled => {
      if (isEnabled) {
        let tooltip = chrome.i18n.getMessage('inject_workflows_menubtn');
        let btn = addButtonToThreadListActions(
            readToggle, 'more_vert', wfDebugId, tooltip);
        btn.addEventListener('click', () => {
          this.switchMenu(btn);
        });
      }
    });
  }

  shouldAddThreadListBtn(node) {
    return shouldAddBtnToActionBar(wfDebugId, node);
  }
};
