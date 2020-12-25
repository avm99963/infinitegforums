var savedSuccessfullyTimeout = null;

const exclusiveOptions = [['thread', 'threadall']];

function save(e) {
  var options = defaultOptions;

  // Validation checks before saving
  var months = document.getElementById('profileindicatoralt_months');
  if (!months.checkValidity()) {
    console.warn(months.validationMessage);
    return;
  }

  e.preventDefault();

  // Save
  Object.keys(options).forEach(function(opt) {
    if (deprecatedOptions.includes(opt)) return;

    if (specialOptions.includes(opt)) {
      switch (opt) {
        case 'profileindicatoralt_months':
          options[opt] = document.getElementById(opt).value || 12;
          break;

        case 'ccdarktheme_mode':
          options[opt] = document.getElementById(opt).value || 'switch';
          break;

        // This option is controlled directly in the Community Console.
        case 'ccdarktheme_switch_enabled':
          break;

        case 'ccdragndropfix':
          options[opt] = document.getElementById(opt).checked || false;
          break;

        default:
          console.warn('Unrecognized option: ' + opt);
          break;
      }
      return;
    }

    options[opt] = document.getElementById(opt).checked || false;
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
}

function i18n() {
  document.querySelectorAll('[data-i18n]')
      .forEach(
          el => el.innerHTML = chrome.i18n.getMessage(
              'options_' + el.getAttribute('data-i18n')));
}

window.addEventListener('load', function() {
  i18n();

  chrome.storage.sync.get(null, function(items) {
    items = cleanUpOptions(items);

    Object.keys(defaultOptions).forEach(function(opt) {
      if (deprecatedOptions.includes(opt)) return;

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

          // This option is controlled directly in the Community Console.
          case 'ccdarktheme_switch_enabled':
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
        return;
      }

      if (items[opt] === true) document.getElementById(opt).checked = true;
    });

    exclusiveOptions.forEach(exclusive => {
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
