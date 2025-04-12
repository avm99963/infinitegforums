import {
  addButtonToThreadListActions,
  shouldAddBtnToActionBar,
  softRefreshView,
} from '../../../contentScripts/communityConsole/utils/common.js';

const kLockDebugId = 'twpt-lock';
export const kModalPaneSelector = '.pane[pane-id="default--1"]';

export const batchLock = {
  shouldAddButton(node: Node) {
    return shouldAddBtnToActionBar(kLockDebugId, node);
  },
  createDialog() {
    const modal = document.querySelector(kModalPaneSelector);

    if (!(modal instanceof HTMLElement)) {
      throw new Error('Modal is not an HTMLElement.');
    }

    const dialog = document.createElement('material-dialog');
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.classList.add('TWPT-dialog');

    const header = document.createElement('header');
    header.setAttribute('role', 'presentation');
    header.classList.add('TWPT-dialog-header');

    const title = document.createElement('div');
    title.classList.add('TWPT-dialog-header--title', 'title');
    title.textContent = chrome.i18n.getMessage('inject_lockbtn');

    header.append(title);

    const main = document.createElement('main');
    main.setAttribute('role', 'presentation');
    main.classList.add('TWPT-dialog-main');

    const p = document.createElement('p');
    p.textContent = chrome.i18n.getMessage('inject_lockdialog_desc');

    main.append(p);

    dialog.append(header, main);

    const footers = [['lock', 'unlock', 'cancel'], ['close']];

    for (let i = 0; i < footers.length; ++i) {
      const footer = document.createElement('footer');
      footer.setAttribute('role', 'presentation');
      footer.classList.add('TWPT-dialog-footer');
      footer.setAttribute('data-footer-id', i.toFixed(0));

      if (i > 0) footer.classList.add('is-hidden');

      footers[i].forEach((action) => {
        const btn = document.createElement('material-button');
        btn.setAttribute('role', 'button');
        btn.classList.add('TWPT-dialog-footer-btn');
        if (i == 1) btn.classList.add('is-disabled');

        switch (action) {
          case 'lock':
          case 'unlock':
            btn.addEventListener('click', (_) => {
              if (btn.classList.contains('is-disabled')) return;
              const message = {
                action,
                prefix: 'TWPT-batchlock',
              };
              window.postMessage(message, '*');
            });
            break;

          case 'cancel':
          case 'close':
            btn.addEventListener('click', (_) => {
              if (btn.classList.contains('is-disabled')) return;

              if (action == 'close') softRefreshView();

              modal.classList.remove('visible');
              modal.style.display = 'none';
              removeChildNodes(modal);
            });
            break;
        }

        const content = document.createElement('div');
        content.classList.add('content', 'TWPT-dialog-footer-btn--content');
        content.textContent = chrome.i18n.getMessage(
          'inject_lockdialog_btn_' + action,
        );

        btn.append(content);
        footer.append(btn);
      });

      const clear = document.createElement('div');
      clear.style.clear = 'both';

      footer.append(clear);
      dialog.append(footer);
    }

    removeChildNodes(modal);
    modal.append(dialog);
    modal.classList.add('visible', 'modal');
    modal.style.display = 'flex';
  },
  addButton(readToggle: Node) {
    let tooltip = chrome.i18n.getMessage('inject_lockbtn');
    let btn = addButtonToThreadListActions(
      readToggle,
      'lock',
      kLockDebugId,
      tooltip,
    );
    btn.addEventListener('click', () => {
      this.createDialog();
    });
  },
};

function removeChildNodes(node: Node) {
  while (node?.firstChild) {
    node.removeChild(node.firstChild);
  }
}
