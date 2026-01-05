import {getSyncStorageAreaRepository} from '@/storage/compositionRoot/index.js';

import {getDocURL, isProdVersion} from '../../common/extUtils.js';
import {optionsPrototype, specialOptions} from '../../common/options/optionsUtils.js';

import optionsPage from './optionsPage.json5';

var savedSuccessfullyTimeout = null;

const exclusiveOptions = [['thread', 'threadall']];

const syncStorageAreaRepository = getSyncStorageAreaRepository();

// Get the value of the option set in the options/experiments page
function getOptionValue(opt) {
  if (specialOptions.includes(opt)) {
    switch (opt) {
      case 'profileindicatoralt_months':
        return document.getElementById(opt).value || 12;

      case 'ccdarktheme_mode':
        return document.getElementById(opt).value || 'switch';

      case 'interopthreadpage_mode':
        return document.getElementById(opt).value || 'previous';

      default:
        console.warn('Unrecognized option: ' + opt);
        return undefined;
    }
  }

  return document.getElementById(opt).checked || false;
}

// Returns whether the option is included in the current context
function isOptionShown(opt) {
  if (!optionsPrototype.hasOwnProperty(opt)) return false;
  return optionsPrototype[opt].context == window.CONTEXT;
}

async function save(e) {
  // Validation checks before saving
  if (isOptionShown('profileindicatoralt_months')) {
    var months = document.getElementById('profileindicatoralt_months');
    if (!months.checkValidity()) {
      console.warn(months.validationMessage);
      return;
    }
  }

  e.preventDefault();

  const options = await syncStorageAreaRepository.get();

  // Save
  Object.keys(options).forEach(function(opt) {
    if (!isOptionShown(opt)) return;
    options[opt] = getOptionValue(opt);
  });

  await syncStorageAreaRepository.set(options);

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
  if (window.CONTEXT == 'options') {
    if (!isProdVersion()) {
      var experimentsLink = document.querySelector('.experiments-link');
      experimentsLink.removeAttribute('hidden');
      experimentsLink.addEventListener('click', _ => chrome.tabs.create({
        url: chrome.runtime.getURL('options/experiments.html'),
      }));
    }

    // Add options to page
    let optionsContainer = document.getElementById('options-container');
    for (let section of optionsPage.sections) {
      if (section?.name) {
        let sectionHeader = document.createElement('h4');
        sectionHeader.setAttribute('data-i18n', section.name);
        optionsContainer.append(sectionHeader);
      }

      if (section?.options) {
        for (let option of section.options) {
          if (option?.customHTML) {
            optionsContainer.insertAdjacentHTML('beforeend', option.customHTML);
          } else {
            let optionEl = document.createElement('div');
            optionEl.classList.add('option');

            let checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.id = option.codename;

            let label = document.createElement('label');
            label.setAttribute('for', checkbox.id);
            label.setAttribute('data-i18n', option.codename);

            optionEl.append(checkbox, ' ', label);

            if (option?.experimental) {
              let experimental = document.createElement('span');
              experimental.classList.add('experimental-label');
              experimental.setAttribute('data-i18n', 'experimental_label');

              optionEl.append(' ', experimental);
            }

            optionsContainer.append(optionEl);
          }

          // Add kill switch component after each option.
          let killSwitchComponent = document.createElement('div');
          killSwitchComponent.classList.add('kill-switch-label');
          killSwitchComponent.setAttribute('hidden', '');
          killSwitchComponent.setAttribute('data-feature', option.codename);
          killSwitchComponent.setAttribute('data-i18n', 'killswitchenabled');

          optionsContainer.append(killSwitchComponent);
        }
      }

      if (section?.footerHTML) {
        optionsContainer.insertAdjacentHTML('beforeend', section.footerHTML);
      }
    }

    var featuresLink = document.querySelector('.features-link');
    featuresLink.href = getDocURL('features.md');

    var profileIndicatorLink =
        document.getElementById('profileIndicatorMoreInfo');
    profileIndicatorLink.href = getDocURL('op_indicator.md');
  }

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

  // If some features have been force disabled, communicate this to the user.
  if (items?._forceDisabledFeatures &&
      items._forceDisabledFeatures.length > 0) {
    if (window.CONTEXT == 'options') {
      document.getElementById('kill-switch-warning').removeAttribute('hidden');
    }
  }

  for (var entry of Object.entries(optionsPrototype)) {
    var opt = entry[0];
    var optMeta = entry[1];

    if (!isOptionShown(opt)) continue;

    if (specialOptions.includes(opt)) {
      switch (opt) {
        case 'profileindicatoralt_months':
          var input = document.createElement('input');
          input.type = 'number';
          input.id = 'profileindicatoralt_months';
          input.max = '12';
          input.min = '1';
          input.value = items[opt];
          input.required = true;
          document.getElementById('profileindicatoralt_months--container')
              .appendChild(input);
          break;

        case 'ccdarktheme_mode':
          var select = document.createElement('select');
          select.id = 'ccdarktheme_mode';

          const modes = ['switch', 'system'];
          for (const mode of modes) {
            var modeOption = document.createElement('option');
            modeOption.value = mode;
            modeOption.textContent =
                chrome.i18n.getMessage('options_ccdarktheme_mode_' + mode);
            if (items.ccdarktheme_mode == mode) modeOption.selected = true;
            select.appendChild(modeOption);
          }

          document.getElementById('ccdarktheme_mode--container')
              .appendChild(select);
          break;

        case 'interopthreadpage_mode':
          var select = document.createElement('select');
          select.id = 'interopthreadpage_mode';

          const threadPageModes = ['previous', 'next'];
          for (const mode of threadPageModes) {
            let modeOption = document.createElement('option');
            modeOption.value = mode;
            modeOption.textContent = chrome.i18n.getMessage(
                'options_interopthreadpage_mode_' + mode);
            if (items.interopthreadpage_mode == mode)
              modeOption.selected = true;
            select.appendChild(modeOption);
          }

          document.getElementById('interopthreadpage_mode--container')
              .appendChild(select);
          break;

        default:
          console.warn('Unrecognized option: ' + opt);
          break;
      }
      continue;
    }

    if (items[opt] === true) document.getElementById(opt).checked = true;
    if (window.CONTEXT == 'options' &&
        items?._forceDisabledFeatures?.includes?.(opt))
      document.querySelector('.kill-switch-label[data-feature="' + opt + '"]')
          .removeAttribute('hidden');
  }

  exclusiveOptions.forEach(exclusive => {
    if (!isOptionShown(exclusive[0]) || !isOptionShown(exclusive[1])) return;

    exclusive.forEach(
        el => document.getElementById(el).addEventListener('change', e => {
          if (document.getElementById(exclusive[0]).checked &&
              document.getElementById(exclusive[1]).checked) {
            document
                .getElementById(
                    exclusive[(e.currentTarget.id == exclusive[0] ? 1 : 0)])
                .checked = false;
          }
        }));
  });

  document.querySelector('#save').addEventListener('click', save);
});
