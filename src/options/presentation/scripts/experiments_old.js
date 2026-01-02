import {OptionContext} from '@/common/options/Option.js';
import {optionsPrototype} from '@/common/options/optionsPrototype.js';
import {getSyncStorageAreaRepository} from '@/storage/compositionRoot/index.js';

var savedSuccessfullyTimeout = null;

const syncStorageAreaRepository = getSyncStorageAreaRepository();

// Get the value of the option set in the experiments page
function getOptionValue(opt) {
  return document.getElementById(opt)?.checked || false;
}

// Returns whether the option is included in the current page
function isExperiment(opt) {
  if (!optionsPrototype.hasOwnProperty(opt)) return false;
  return optionsPrototype[opt].context == OptionContext.Experiments;
}

async function save(e) {
  e.preventDefault();

  // Save
  const optionsToUpdate = {};
  for (const opt of Object.keys(optionsPrototype)) {
    if (isExperiment(opt)) {
      optionsToUpdate[opt] = getOptionValue(opt);
    }
  }

  await syncStorageAreaRepository.set(optionsToUpdate);

  window.close();

  // In browsers like Firefox window.close is not supported:
  if (savedSuccessfullyTimeout !== null)
    window.clearTimeout(savedSuccessfullyTimeout);

  document.getElementById('save-indicator').innerText =
      '✓ ' + chrome.i18n.getMessage('options_saved');
  savedSuccessfullyTimeout = window.setTimeout(_ => {
    document.getElementById('save-indicator').innerText = '';
  }, 3699);
}

function i18n() {
  document.querySelectorAll('[data-i18n]')
      .forEach(
          el => el.innerHTML = chrome.i18n.getMessage(
              'options_' + el.getAttribute('data-i18n')));
}

window.addEventListener('load', async function() {
  i18n();

  // Add custom handlers
  let manageWorkflowsBtn = document.getElementById('manage-workflows');
  if (manageWorkflowsBtn)
    manageWorkflowsBtn.addEventListener('click', e => {
      e.preventDefault();
      chrome.tabs.create({
        url: chrome.runtime.getURL('workflows.html'),
      })
    });

  const items = await syncStorageAreaRepository.get();

  for (const opt of Object.keys(optionsPrototype)) {
    if (!isExperiment(opt)) continue;

    if (items[opt] === true) document.getElementById(opt).checked = true;
  }

  document.querySelector('#save').addEventListener('click', save);
});
