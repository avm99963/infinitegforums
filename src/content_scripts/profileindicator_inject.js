chrome.storage.sync.get(null, function(options) {
  if (options.profileindicator || options.profileindicatoralt) {
    // In order to pass i18n strings and settings values to the injected script,
    // which doesn't have access to the chrome.* APIs, we use event listeners.
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
          break;
      }
      var response = {data, requestId: request.id, prefix: 'TWPT'};

      window.postMessage(response, '*');
    });

    injectScript(
        chrome.runtime.getURL('injections/profileindicator_inject.js'));
    injectStylesheet(
        chrome.runtime.getURL('injections/profileindicator_inject.css'));
  }
});
