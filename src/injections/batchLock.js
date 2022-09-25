import {CCApi} from '../common/api.js';
import {parseUrl} from '../common/commonUtils.js';
import {getAuthUser} from '../common/communityConsoleUtils.js';

function recursiveParentElement(el, tag) {
  while (el !== document.documentElement) {
    el = el.parentNode;
    if (el.tagName == tag) return el;
  }
  return undefined;
}

// Source:
// https://stackoverflow.com/questions/33063774/communication-from-an-injected-script-to-the-content-script-with-a-response
var contentScriptRequest = (function() {
  var requestId = 0;
  var prefix = 'TWPT-batchlock-generic';

  function sendRequest(data) {
    var id = requestId++;

    return new Promise(function(resolve, reject) {
      var listener = function(evt) {
        if (evt.source === window && evt.data && evt.data.prefix === prefix &&
            evt.data.requestId == id) {
          // Deregister self
          window.removeEventListener('message', listener);
          resolve(evt.data.data);
        }
      };

      window.addEventListener('message', listener);

      var payload = {data, id, prefix};

      window.dispatchEvent(
          new CustomEvent('TWPT_sendRequest', {detail: payload}));
    });
  }

  return {sendRequest: sendRequest};
})();

function enableEndButtons() {
  var buttons = document.querySelectorAll(
      '.pane[pane-id="default-1"] footer[data-footer-id="1"] material-button');
  buttons.forEach(btn => {
    btn.classList.remove('is-disabled');
  });
}

function addLogEntry(success, action, url, threadId, errDetails = null) {
  var p1 = contentScriptRequest.sendRequest({
    action: 'geti18nMessage',
    msg: 'inject_lockdialog_log_entry_beginning',
    placeholders: [threadId],
  });

  var p2 = contentScriptRequest.sendRequest({
    action: 'geti18nMessage',
    msg: 'inject_lockdialog_log_entry_' + (success ? 'success' : 'error') +
        '_' + action,
    placeholders: [errDetails],
  });

  Promise.all([p1, p2]).then(strings => {
    var log = document.getElementById('TWPT-lock-log');
    var logEntry = document.createElement('p');
    logEntry.classList.add(
        'TWPT-log-entry', 'TWPT-log-entry--' + (success ? 'success' : 'error'));

    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.textContent = strings[0];

    var end = document.createTextNode(': ' + strings[1]);

    logEntry.append(a, end);
    log.append(logEntry);
  });
}

function lockThreads(action) {
  var modal = document.querySelector('.pane[pane-id="default-1"]');
  modal.querySelector('footer[data-footer-id="0"]').classList.add('is-hidden');
  modal.querySelector('footer[data-footer-id="1"]')
      .classList.remove('is-hidden');

  var checkboxes = document.querySelectorAll(
      '.thread-group material-checkbox[aria-checked="true"]');

  var p = document.createElement('p');
  p.style.textAlign = 'center';

  var progress = document.createElement('progress');
  progress.max = checkboxes.length;
  progress.value = 0;

  p.append(progress);

  var log = document.createElement('div');
  log.id = 'TWPT-lock-log';
  log.classList.add('TWPT-log');

  modal.querySelector('main').textContent = '';
  modal.querySelector('main').append(p, log);

  var authuser = getAuthUser();

  checkboxes.forEach(checkbox => {
    var url = recursiveParentElement(checkbox, 'EC-THREAD-SUMMARY')
                  .querySelector('a.header-content')
                  .href;
    var thread = parseUrl(url);
    if (thread === false) {
      console.error('Fatal error: thread URL ' + url + ' could not be parsed.');
      return;
    }
    CCApi(
        'SetThreadAttribute', {
          1: thread.forum,
          2: thread.thread,
          3: (action == 'lock' ? 1 : 2),
        },
        /* authenticated = */ true, authuser)
        .then(() => {
          addLogEntry(true, action, url, thread.thread);
        })
        .catch(err => {
          console.error(
              'An error occurred while locking thread ' + url + ': ' + err);
          addLogEntry(false, action, url, thread.thread, err);
        })
        .then(() => {
          progress.value = parseInt(progress.value) + 1;
          if (progress.value == progress.getAttribute('max'))
            enableEndButtons();
        });
  });
}

window.addEventListener('message', e => {
  if (e.source === window && e.data && e.data.prefix === 'TWPT-batchlock' &&
      e.data.action) {
    switch (e.data.action) {
      case 'lock':
      case 'unlock':
        console.debug('Performing action ' + e.data.action);
        lockThreads(e.data.action);
        break;

      default:
        console.error(
            'Action \'' + e.data.action +
            '\' unknown to TWPT-batchlock receiver.');
    }
  }
});
