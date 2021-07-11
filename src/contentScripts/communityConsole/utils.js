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
  var badge = document.createElement('div');
  badge.classList.add('TWPT-badge');
  badge.setAttribute(
      'title', chrome.i18n.getMessage('inject_extension_badge_helper', [
        chrome.i18n.getMessage('appName')
      ]));

  var badgeI = document.createElement('i');
  badgeI.classList.add('material-icon-i', 'material-icons-extended');
  badgeI.textContent = 'repeat';

  badge.append(badgeI);
  return badge;
}
