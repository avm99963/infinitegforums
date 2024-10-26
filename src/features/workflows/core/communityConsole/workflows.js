import {isOptionEnabled} from '../../../../common/options/optionsUtils.js';
import WorkflowsStorage from '../workflowsStorage.js';
import {addElementToThreadListActions, shouldAddBtnToActionBar} from '../../../../contentScripts/communityConsole/utils/common.js';

const wfDebugId = 'twpt-workflows';

export default class Workflows {
  constructor() {
    this.isSetUp = false;
    this.menu = null;
    this.workflows = null;
  }

  setUp() {
    if (this.isSetUp) return;

    // Always keep the workflows list updated
    WorkflowsStorage.watch(workflows => {
      this.workflows = workflows;
      this._emitWorkflowsUpdateEvent();
    }, /* asProtobuf = */ false);

    // Open the workflow manager when instructed to do so.
    document.addEventListener('twpt-open-workflow-manager', () => {
      chrome.runtime.sendMessage({
        message: 'openWorkflowsManager',
      });
    });

    this.isSetup = true;
  }

  _emitWorkflowsUpdateEvent() {
    if (!this.menu) return;
    const e = new CustomEvent('twpt-workflows-update', {
      detail: {
        workflows: this.workflows,
      }
    });
    this.menu?.dispatchEvent?.(e);
  }

  addThreadListBtnIfEnabled(readToggle) {
    this.setUp();

    isOptionEnabled('workflows').then(isEnabled => {
      if (isEnabled) {
        this.menu = document.createElement('twpt-workflows-inject');
        this.menu.setAttribute('debugid', wfDebugId);
        this._emitWorkflowsUpdateEvent();
        addElementToThreadListActions(readToggle, this.menu);
      }
    });
  }

  shouldAddThreadListBtn(node) {
    return shouldAddBtnToActionBar(wfDebugId, node);
  }
};
