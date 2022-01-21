import {getExtVersion, isProdVersion} from '../common/extUtils.js';
import {ensureOptPermissions, grantedOptPermissions, missingPermissions} from '../common/optionsPermissions.js';
import {cleanUpOptions, optionsPrototype, specialOptions} from '../common/optionsUtils.js';

import optionsPage from './optionsPage.json5';

var savedSuccessfullyTimeout = null;

const exclusiveOptions = [['thread', 'threadall']];
const kClickShouldEnableFeat = 'data-click-should-enable-feature';

// Get a URL to a document which is part of the extension documentation (using
// |ref| as the Git ref).
function getDocURLWithRef(doc, ref) {
  return 'https://gerrit.avm99963.com/plugins/gitiles/infinitegforums/+/' +
      ref + '/docs/' + doc;
}

// Get a URL to a document which is part of the extension documentation
// (autodetect the appropriate Git ref)
function getDocURL(doc) {
  if (!isProdVersion()) return getDocURLWithRef(doc, 'HEAD');

  var version = getExtVersion();
  return getDocURLWithRef(doc, 'refs/tags/v' + version);
}

// Get the value of the option set in the options/experiments page
function getOptionValue(opt) {
  if (specialOptions.includes(opt)) {
    switch (opt) {
      case 'profileindicatoralt_months':
        return document.getElementById(opt).value || 12;

      case 'ccdarktheme_mode':
        return document.getElementById(opt).value || 'switch';

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

function save(e) {
  // Validation checks before saving
  if (isOptionShown('profileindicatoralt_months')) {
    var months = document.getElementById('profileindicatoralt_months');
    if (!months.checkValidity()) {
      console.warn(months.validationMessage);
      return;
    }
  }

  e.preventDefault();

  chrome.storage.sync.get(null, function(items) {
    var options = cleanUpOptions(items, true);

    // Save
    Object.keys(options).forEach(function(opt) {
      if (!isOptionShown(opt)) return;
      options[opt] = getOptionValue(opt);
    });

    chrome.storage.sync.set(options, function() {
      window.close();

      // In browsers like Firefox window.close is not supported:
      if (savedSuccessfullyTimeout !== null)
        window.clearTimeout(savedSuccessfullyTimeout);

      document.getElementById('save-indicator').innerText =
          '✓ ' + chrome.i18n.getMessage('options_saved');
      savedSuccessfullyTimeout = window.setTimeout(_ => {
        document.getElementById('save-indicator').innerText = '';
      }, 3699);
    });
  });
}

function i18n() {
  document.querySelectorAll('[data-i18n]')
      .forEach(
          el => el.innerHTML = chrome.i18n.getMessage(
              'options_' + el.getAttribute('data-i18n')));
}

window.addEventListener('load', function() {
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

          // Add optional permissions warning label and kill switch component
          // after each option.
          let optionalPermissionsWarningLabel = document.createElement('div');
          optionalPermissionsWarningLabel.classList.add(
              'optional-permissions-warning-label');
          optionalPermissionsWarningLabel.setAttribute('hidden', '');
          optionalPermissionsWarningLabel.setAttribute(
              'data-feature', option.codename);
          optionalPermissionsWarningLabel.setAttribute(
              'data-i18n', 'optionalpermissionswarning_label');

          let killSwitchComponent = document.createElement('div');
          killSwitchComponent.classList.add('kill-switch-label');
          killSwitchComponent.setAttribute('hidden', '');
          killSwitchComponent.setAttribute('data-feature', option.codename);
          killSwitchComponent.setAttribute('data-i18n', 'killswitchenabled');

          optionsContainer.append(
              optionalPermissionsWarningLabel, killSwitchComponent);
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

  chrome.storage.sync.get(null, function(items) {
    items = cleanUpOptions(items, false);

    // If some features have been force disabled, communicate this to the user.
    if (items?._forceDisabledFeatures &&
        items._forceDisabledFeatures.length > 0) {
      if (window.CONTEXT == 'options') {
        document.getElementById('kill-switch-warning')
            .removeAttribute('hidden');
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

    // Handle options which need optional permissions.
    grantedOptPermissions()
        .then(grantedPerms => {
          for (const [opt, optMeta] of Object.entries(optionsPrototype)) {
            if (!optMeta.requiredOptPermissions?.length || !isOptionShown(opt))
              continue;

            let warningLabel = document.querySelector(
                '.optional-permissions-warning-label[data-feature="' + opt +
                '"]');

            // Ensure we have the appropriate permissions when the checkbox
            // switches from disabled to enabled.
            //
            // Also, if the checkbox was indeterminate because the feature was
            // enabled but not all permissions had been granted, enable the
            // feature in order to trigger the permission request again.
            let checkbox = document.getElementById(opt);
            if (!checkbox) {
              console.error('Expected checkbox for feature "' + opt + '".');
              continue;
            }
            checkbox.addEventListener('change', () => {
              if (checkbox.hasAttribute(kClickShouldEnableFeat)) {
                checkbox.removeAttribute(kClickShouldEnableFeat);
                checkbox.checked = true;
              }

              if (checkbox.checked)
                ensureOptPermissions(opt)
                    .then(granted => {
                      if (granted) {
                        warningLabel.setAttribute('hidden', '');
                        if (!document.querySelector(
                                '.optional-permissions-warning-label:not([hidden])'))
                          document
                              .getElementById('optional-permissions-warning')
                              .setAttribute('hidden', '');
                      } else
                        document.getElementById(opt).checked = false;
                    })
                    .catch(err => {
                      console.error(
                          'An error ocurred while ensuring that the optional ' +
                              'permissions were granted after the checkbox ' +
                              'was clicked for feature "' + opt + '":',
                          err);
                      document.getElementById(opt).checked = false;
                    });
            });

            // Add warning message if some permissions are missing and the
            // feature is enabled.
            if (items[opt] === true) {
              let shownHeaderMessage = false;
              missingPermissions(opt, grantedPerms)
                  .then(missingPerms => {
                    console.log(missingPerms);
                    if (missingPerms.length > 0) {
                      checkbox.indeterminate = true;
                      checkbox.setAttribute(kClickShouldEnableFeat, '');

                      warningLabel.removeAttribute('hidden');

                      if (!shownHeaderMessage) {
                        shownHeaderMessage = true;
                        document.getElementById('optional-permissions-warning')
                            .removeAttribute('hidden');
                      }
                    }
                  })
                  .catch(err => console.error(err));
            }
          }
        })
        .catch(err => console.error(err));

    document.querySelector('#save').addEventListener('click', save);
  });
});
