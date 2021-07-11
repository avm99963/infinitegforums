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
