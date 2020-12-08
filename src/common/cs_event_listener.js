// In order to pass i18n strings and settings values to the injected scripts,
// which don't have access to the chrome.* APIs, we use event listeners.
chrome.storage.sync.get(null, function(options) {
  window.addEventListener('TWPT_sendRequest', evt => {
    var request = evt.detail;
    switch (request.data.action) {
      case 'geti18nMessage':
        var data = chrome.i18n.getMessage(
            request.data.msg,
            (Array.isArray(request.data.placeholders) ?
                 request.data.placeholders :
                 []));
        break;

      case 'getProfileIndicatorOptions':
        var data = {
          'indicatorDot': options.profileindicator,
          'numPosts': options.profileindicatoralt
        };
        break;

      case 'getNumPostMonths':
        var data = options.profileindicatoralt_months;
        break;

      default:
        var data = 'unknownAction';
        console.warn('Unknown action ' + request.data.action + '.');
        break;
    }

    var response = {
      data,
      requestId: request.id,
      prefix: (request.prefix || 'TWPT'),
    };

    window.postMessage(response, '*');
  });
});
