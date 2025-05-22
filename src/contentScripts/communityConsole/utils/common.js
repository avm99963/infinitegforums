import {waitFor} from 'poll-until-promise';

import {createPlainTooltip} from '../../../common/tooltip.js';
import {ViewSoftRefresherServiceAdapter} from '../../../infrastructure/ui/services/communityConsole/viewSoftRefresher.service.adapter';

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

/**
 * Adds an element to the thread list actions bar next to the button given by
 * |originalBtn|.
 */
export function addElementToThreadListActions(originalBtn, element) {
  var duplicateBtn =
      originalBtn.parentNode.querySelector('[debugid="mark-duplicate-button"]');
  if (duplicateBtn)
    duplicateBtn.parentNode.insertBefore(
        element, (duplicateBtn.nextSibling || duplicateBtn));
  else
    originalBtn.parentNode.insertBefore(
        element, (originalBtn.nextSibling || originalBtn));
}

/**
 * Returns true if |node| is the "mark as read/unread" button, the parent of the
 * parent of |node| is the actions bar of the thread list, and the button with
 * debugid |debugid| is NOT part of the actions bar.
 *
 * @deprecated Use CCThreadListActionInjectorAdapter
 */
export function shouldAddBtnToActionBar(debugid, node) {
  return node?.tagName == 'MATERIAL-BUTTON' &&
      (node.getAttribute?.('debugid') == 'mark-read-button' ||
       node.getAttribute?.('debugid') == 'mark-unread-button') &&
      node.parentNode?.querySelector('[debugid="' + debugid + '"]') === null &&
      node.parentNode?.parentNode?.tagName == 'EC-BULK-ACTIONS';
}

/**
 * Returns the display language set by the user.
 */
export function getDisplayLanguage() {
  var startup =
      JSON.parse(document.querySelector('html').getAttribute('data-startup'));
  return startup?.[1]?.[1]?.[3]?.[6] ?? 'en';
}

/**
 * Refreshes the current view in the Community Console without reloading the
 * whole page if possible.
 *
 * @deprecated Use `ViewSoftRefresherServicePort`.
 */
export function softRefreshView() {
  const viewSoftRefresher = new ViewSoftRefresherServiceAdapter();
  viewSoftRefresher.refresh({forceRefresh: true});
}

/**
 * Opens the vanilla Community Console reply editor.
 * @param {string} messageId The id of the message for which to open the reply
 * editor.
 * @returns {Promise<Element>} A promise resolving to the reply editor.
 */
export async function openReplyEditor(messageId) {
  const nodeReply =
      document.querySelector('[data-twpt-message-id="' + messageId + '"]')
          ?.closest?.('sc-tailwind-thread-message-message-card');
  const nodeReplyButton = nodeReply?.querySelector?.(
      '.scTailwindThreadMessageMessagecardadd-comment button');
  if (!nodeReplyButton) {
    // This is not critical: the reply button might already have been clicked
    // (so it no longer exists), or the thread might be locked so replying is
    // disabled and the button doesn't exist.
    console.debug('[flattenThreads] Reply button not found.');
    return null;
  }

  nodeReplyButton.click();

  return await waitFor(() => {
    const editor = nodeReply?.querySelector('sc-tailwind-thread-reply-editor');
    if (editor) return Promise.resolve(editor);
    return Promise.reject(new Error('Editor not found.'));
  }, {interval: 75, timeout: 10 * 1000});
}
