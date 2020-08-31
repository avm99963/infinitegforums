var savedSuccessfullyTimeout = null;

function save() {
  var options = defaultOptions;

  Object.keys(options).forEach(function(opt) {
    if (deprecatedOptions.includes(opt)) return;
    options[opt] = document.querySelector('#' + opt).checked || false;
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

function thread() {
  if (document.querySelector('#thread').checked &&
      document.querySelector('#threadall').checked) {
    document.querySelector('#' + (this.id == 'thread' ? 'threadall' : 'thread'))
        .checked = false;
  }
}

window.addEventListener('load', function() {
  i18n();

  chrome.storage.sync.get(null, function(items) {
    items = cleanUpOptions(items);

    Object.keys(defaultOptions).forEach(function(opt) {
      if (items[opt] === true && !deprecatedOptions.includes(opt)) {
        document.querySelector('#' + opt).checked = true;
      }
    });

    ['thread', 'threadall'].forEach(
        el => document.querySelector('#' + el).addEventListener(
            'change', thread));
    document.querySelector('#save').addEventListener('click', save);
  });
});
