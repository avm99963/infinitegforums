import {MDCTooltip} from '@material/tooltip';

import {createPlainTooltip} from '../../../common/tooltip.js';

export function removeChildNodes(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function getNParent(node, n) {
  if (n <= 0) return node;
  if (!('parentNode' in node)) return null;
  return getNParent(node.parentNode, n - 1);
}

export function createExtBadge() {
  let badge = document.createElement('div');
  badge.classList.add('TWPT-badge');
  let badgeTooltip = createPlainTooltip(
      badge,
      chrome.i18n.getMessage(
          'inject_extension_badge_helper', [chrome.i18n.getMessage('appName')]),
      false);

  let badgeI = document.createElement('i');
  badgeI.classList.add('material-icon-i', 'material-icons-extended');
  badgeI.textContent = 'repeat';

  badge.append(badgeI);
  return [badge, badgeTooltip];
}

// Adds a button to the thread list actions bar next to the button given by
// |originalBtn|. The button will have icon |icon|, when hovered it will display
// |tooltip|, and will have a debugid attribute with value |debugId|.
export function addButtonToThreadListActions(
    originalBtn, icon, debugId, tooltip) {
  let clone = originalBtn.cloneNode(true);
  clone.setAttribute('debugid', debugId);
  clone.classList.add('TWPT-btn--with-badge');
  clone.querySelector('material-icon').setAttribute('icon', icon);
  clone.querySelector('i.material-icon-i').textContent = icon;

  let badge, badgeTooltip;
  [badge, badgeTooltip] = createExtBadge();
  clone.append(badge);

  var duplicateBtn =
      originalBtn.parentNode.querySelector('[debugid="mark-duplicate-button"]');
  if (duplicateBtn)
    duplicateBtn.parentNode.insertBefore(
        clone, (duplicateBtn.nextSibling || duplicateBtn));
  else
    originalBtn.parentNode.insertBefore(
        clone, (originalBtn.nextSibling || originalBtn));

  createPlainTooltip(clone, tooltip);
  new MDCTooltip(badgeTooltip);

  return clone;
}

// Returns true if |node| is the "mark as read/unread" button, the parent of the
// parent of |node| is the actions bar of the thread list, and the button with
// debugid |debugid| is NOT part of the actions bar.
export function shouldAddBtnToActionBar(debugid, node) {
  return node?.tagName == 'MATERIAL-BUTTON' &&
      (node.getAttribute?.('debugid') == 'mark-read-button' ||
       node.getAttribute?.('debugid') == 'mark-unread-button') &&
      node.getAttribute?.('debugid') !== null &&
      node.parentNode?.querySelector('[debugid="' + debugid + '"]') === null &&
      node.parentNode?.parentNode?.tagName == 'EC-BULK-ACTIONS';
}
