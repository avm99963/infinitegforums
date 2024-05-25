import {isOptionEnabled} from '../../common/options/optionsUtils.js';

export function applyDragAndDropFix(node) {
  console.debug('Adding link drag&drop fix to ', node);
  node.addEventListener('drop', e => {
    if (e.dataTransfer.types.includes('text/uri-list')) {
      e.stopImmediatePropagation();
      console.debug('Stopping link drop event propagation.');
    }
  }, true);
}

export function applyDragAndDropFixIfEnabled(node) {
  isOptionEnabled('ccdragndropfix').then(isEnabled => {
    if (isEnabled) applyDragAndDropFix(node);
  });
}
