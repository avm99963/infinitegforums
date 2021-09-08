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
