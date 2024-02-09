export function parseUrl(url) {
  var forum_a = url.match(/forum\/([0-9]+)/i);
  var thread_a = url.match(/thread\/([0-9]+)/i);
  var message_a = url.match(/message\/([0-9]+)/i);

  if (forum_a === null || thread_a === null) {
    return false;
  }

  return {
    'forum': forum_a[1],
    'thread': thread_a[1],
    'message': message_a !== null ? message_a[1] : null,
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

export function recursiveParentElement(el, tag) {
  while (el !== document.documentElement) {
    el = el.parentNode;
    if (el.tagName == tag) return el;
  }
  return undefined;
}

/**
 * Utility to indicate that a class method should be implemented (similarly to
 * abstract methods in Java).
 */
export function shouldImplement(name) {
  throw new Error(
      `The ${name} method should be implemented by the extending class.`);
}
