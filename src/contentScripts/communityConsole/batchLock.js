import {isOptionEnabled} from '../../common/optionsUtils.js';

import {createExtBadge, removeChildNodes} from './utils/common.js';

export var batchLock = {
  nodeIsReadToggleBtn(node) {
    return ('tagName' in node) && node.tagName == 'MATERIAL-BUTTON' &&
        node.getAttribute('debugid') !== null &&
        (node.getAttribute('debugid') == 'mark-read-button' ||
         node.getAttribute('debugid') == 'mark-unread-button') &&
        ('parentNode' in node) && node.parentNode !== null &&
        ('parentNode' in node.parentNode) &&
        node.parentNode.querySelector('[debugid="batchlock"]') === null &&
        node.parentNode.parentNode !== null &&
        ('tagName' in node.parentNode.parentNode) &&
        node.parentNode.parentNode.tagName == 'EC-BULK-ACTIONS';
  },
  createDialog() {
    var modal = document.querySelector('.pane[pane-id="default-1"]');

    var dialog = document.createElement('material-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.classList.add('TWPT-dialog');

    var header = document.createElement('header');
    header.setAttribute('role', 'presentation');
    header.classList.add('TWPT-dialog-header');

    var title = document.createElement('div');
    title.classList.add('TWPT-dialog-header--title', 'title');
    title.textContent = chrome.i18n.getMessage('inject_lockbtn');

    header.append(title);

    var main = document.createElement('main');
    main.setAttribute('role', 'presentation');
    main.classList.add('TWPT-dialog-main');

    var p = document.createElement('p');
    p.textContent = chrome.i18n.getMessage('inject_lockdialog_desc');

    main.append(p);

    dialog.append(header, main);

    var footers = [['lock', 'unlock', 'cancel'], ['close']];

    for (var i = 0; i < footers.length; ++i) {
      var footer = document.createElement('footer');
      footer.setAttribute('role', 'presentation');
      footer.classList.add('TWPT-dialog-footer');
      footer.setAttribute('data-footer-id', i);

      if (i > 0) footer.classList.add('is-hidden');

      footers[i].forEach(action => {
        var btn = document.createElement('material-button');
        btn.setAttribute('role', 'button');
        btn.classList.add('TWPT-dialog-footer-btn');
        if (i == 1) btn.classList.add('is-disabled');

        switch (action) {
          case 'lock':
          case 'unlock':
            btn.addEventListener('click', _ => {
              if (btn.classList.contains('is-disabled')) return;
              var message = {
                action,
                prefix: 'TWPT-batchlock',
              };
              window.postMessage(message, '*');
            });
            break;

          case 'cancel':
          case 'close':
            btn.addEventListener('click', _ => {
              if (btn.classList.contains('is-disabled')) return;

              if (action == 'close') {
                var refreshButton = document.querySelector('.app-title-button');
                if (refreshButton == null)
                  window.location.reload();
                else
                  refreshButton.click();
              }

              modal.classList.remove('visible');
              modal.style.display = 'none';
              removeChildNodes(modal);
            });
            break;
        }

        var content = document.createElement('div');
        content.classList.add('content', 'TWPT-dialog-footer-btn--content');
        content.textContent =
            chrome.i18n.getMessage('inject_lockdialog_btn_' + action);

        btn.append(content);
        footer.append(btn);
      });

      var clear = document.createElement('div');
      clear.style.clear = 'both';

      footer.append(clear);
      dialog.append(footer);
    }

    removeChildNodes(modal);
    modal.append(dialog);
    modal.classList.add('visible', 'modal');
    modal.style.display = 'flex';
  },
  addButton(readToggle) {
    var clone = readToggle.cloneNode(true);
    clone.setAttribute('debugid', 'batchlock');
    clone.classList.add('TWPT-btn--with-badge');
    clone.setAttribute('title', chrome.i18n.getMessage('inject_lockbtn'));
    clone.querySelector('material-icon').setAttribute('icon', 'lock');
    clone.querySelector('i.material-icon-i').textContent = 'lock';

    var badge = createExtBadge();
    clone.append(badge);

    clone.addEventListener('click', () => {
      this.createDialog();
    });

    var duplicateBtn = readToggle.parentNode.querySelector(
        '[debugid="mark-duplicate-button"]');
    if (duplicateBtn)
      duplicateBtn.parentNode.insertBefore(
          clone, (duplicateBtn.nextSibling || duplicateBtn));
    else
      readToggle.parentNode.insertBefore(
          clone, (readToggle.nextSibling || readToggle));
  },
  addButtonIfEnabled(readToggle) {
    isOptionEnabled('batchlock').then(isEnabled => {
      if (isEnabled) this.addButton(readToggle);
    });
  },
};
