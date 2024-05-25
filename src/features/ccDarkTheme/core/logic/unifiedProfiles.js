export var unifiedProfilesFix = {
  checkIframe(iframe) {
    var srcRegex = /support.*\.google\.com\/profile\//;
    return srcRegex.test(iframe.src ?? '');
  },
  fixIframe(iframe) {
    console.debug('[unifiedProfilesFix] Fixing unified profiles iframe');
    var url = new URL(iframe.src);
    url.searchParams.set('dark', 1);
    iframe.src = url.href;
  },
};
