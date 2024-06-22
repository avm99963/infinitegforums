import {waitFor} from 'poll-until-promise';

import {recursiveParentElement} from '../../../../common/commonUtils.js';
import {injectStylesheet} from '../../../../common/contentScriptsUtils';
import {isOptionEnabled} from '../../../../common/options/optionsUtils.js';

const kListCannedResponsesResponse = 'TWPT_ListCannedResponsesResponse';

const kImportParam = 'TWPTImportToWorkflow';
const kSelectedIdParam = 'TWPTSelectedId';

// Class which is used to inject a "select" button in the CRs list when loading
// the canned response list for this purpose from the workflows manager.
export default class WorkflowsImport {
  constructor() {
    // Only set this class up if the Community Console was opened with the
    // purpose of importing CRs to the workflow manager.
    const searchParams = new URLSearchParams(document.location.search);
    this.isSetUp = searchParams.has(kImportParam);
    if (!this.isSetUp) return;

    this.selectedId = searchParams.get(kSelectedIdParam);

    this.lastCRsList = {
      body: {},
      id: -1,
      duplicateNames: new Set(),
    };

    this.setUpHandler();
    this.addCustomStyles();
  }

  setUpHandler() {
    window.addEventListener(kListCannedResponsesResponse, e => {
      if (e.detail.id < this.lastCRsList.id) return;

      // Look if there are duplicate names
      const crs = e.detail.body?.['1'] ?? [];
      const names = crs.map(cr => cr?.['7']).slice().sort();
      let duplicateNames = new Set();
      for (let i = 1; i < names.length; i++)
        if (names[i - 1] == names[i]) duplicateNames.add(names[i]);

      this.lastCRsList = {
        body: e.detail.body,
        id: e.detail.id,
        duplicateNames,
      };
    });
  }

  addCustomStyles() {
    injectStylesheet(chrome.runtime.getURL('css/workflow_import.css'));
  }

  addButton(tags) {
    const cr = recursiveParentElement(tags, 'EC-CANNED-RESPONSE-ROW');
    if (!cr) return;

    const name = cr.querySelector('.text .name').textContent;
    if (!name) return;

    const toolbar = cr.querySelector('.action .toolbar');
    if (!toolbar) return console.error(`Can't find toolbar.`);

    // If it has already been injected, exit.
    if (toolbar.querySelector('twpt-cr-import-button')) return;

    waitFor(() => {
      if (this.lastCRsList.id != -1) return Promise.resolve(this.lastCRsList);
      return Promise.reject(new Error('Didn\'t receive canned responses list'));
    }, {
      interval: 500,
      timeout: 15 * 1000,
    }).then(crs => {
      // If another CR has the same name, there's no easy way to distinguish
      // them, so don't inject the button.
      if (crs.duplicateNames.has(name)) {
        console.warning(
            'CR "' + name +
            '" is duplicate, so skipping the injection of the button.');
        return;
      }

      for (const cr of (crs.body?.[1] ?? [])) {
        if (cr[7] == name) {
          const id = cr?.[1]?.[1];
          if (!id) {
            console.error('Can\'t find ID for canned response', cr);
            break;
          }

          const button = document.createElement('twpt-cr-import-button');
          button.setAttribute('cannedResponseId', id);
          if (this.selectedId == id) button.setAttribute('selected', '');
          toolbar.prepend(button);
          break;
        }
      }
    });
  }

  addButtonIfApplicable(tags) {
    if (!this.isSetUp) return;
    isOptionEnabled('workflows').then(isEnabled => {
      if (isEnabled) this.addButton(tags);
    });
  }
}
