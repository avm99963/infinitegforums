export function parseUrl(url) {
  var forum_a = url.match(/forum\/([0-9]+)/i);
  var thread_a = url.match(/thread\/([0-9]+)/i);

  if (forum_a === null || thread_a === null) {
    return false;
  }

  return {
    'forum': forum_a[1],
    'thread': thread_a[1],
  };
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Create a link element which isn't handled by the Community Console when
// clicked. This is done by cancelling the event propagation in the beginning of
// the bubbling phase.
export function createImmuneLink() {
  var a = document.createElement('a');
  a.addEventListener('click', e => e.stopPropagation(), false);
  return a;
}
