import {getExtVersion, isFirefox, isReleaseVersion} from './common/extUtils.js';
import {cleanUpOptions, optionsPrototype, specialOptions} from './common/optionsUtils.js';

var savedSuccessfullyTimeout = null;

const exclusiveOptions = [['thread', 'threadall']];

// Get a URL to a document which is part of the extension documentation (using
// |ref| as the Git ref).
function getDocURLWithRef(doc, ref) {
  return 'https://gerrit.avm99963.com/plugins/gitiles/infinitegforums/+/' +
      ref + '/docs/' + doc;
}

// Get a URL to a document which is part of the extension documentation
// (autodetect the appropriate Git ref)
function getDocURL(doc) {
  if (!isReleaseVersion()) return getDocURLWithRef(doc, 'HEAD');

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

      case 'ccdragndropfix':
        return document.getElementById(opt).checked || false;

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
  i18n();

  if (window.CONTEXT == 'options') {
    if (!isReleaseVersion()) {
      var experimentsLink = document.querySelector('.experiments-link');
      experimentsLink.removeAttribute('hidden');
      experimentsLink.addEventListener('click', _ => chrome.tabs.create({
        url: chrome.runtime.getURL('options/experiments.html'),
      }));
    }

    var featuresLink = document.querySelector('.features-link');
    featuresLink.href = getDocURL('features.md');

    var profileIndicatorLink = document.getElementById('profileIndicatorMoreInfo');
    profileIndicatorLink.href = getDocURL('op_indicator.md');
  }

  chrome.storage.sync.get(null, function(items) {
    items = cleanUpOptions(items, false);

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

          // Firefox doesn't support drag and dropping bookmarks into the text
          // editor while preserving the bookmark title.
          case 'ccdragndropfix':
            var showOption = !isFirefox();
            if (showOption) {
              document.getElementById('dragndrop-wrapper')
                  .removeAttribute('hidden');

              if (items[opt] === true)
                document.getElementById(opt).checked = true;
            }
            break;

          default:
            console.warn('Unrecognized option: ' + opt);
            break;
        }
        continue;
      }

      if (items[opt] === true) document.getElementById(opt).checked = true;
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
});
