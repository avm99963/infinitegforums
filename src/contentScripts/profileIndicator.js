import {injectScript, injectStylesheet} from '../common/contentScriptsUtils';

import {getOptions} from '../common/options/optionsUtils.js';

// In order to pass i18n strings and settings values to the injected scripts,
// which don't have access to the chrome.* APIs, we use event listeners.
export function setUpListener() {
  window.addEventListener('TWPT_sendRequest', evt => {
    var request = evt.detail;

    Promise.resolve(null)
        .then(() => {
          switch (request.data.action) {
            case 'geti18nMessage':
              return chrome.i18n.getMessage(
                  request.data.msg,
                  (Array.isArray(request.data.placeholders) ?
                       request.data.placeholders :
                       []));

            case 'getProfileIndicatorOptions':
              return getOptions(['profileindicator', 'profileindicatoralt'])
                  .then(options => {
                    return {
                      indicatorDot: options?.profileindicator ?? false,
                      numPosts: options?.profileindicatoralt ?? false,
                    };
                  });

            case 'getNumPostMonths':
              return getOptions('profileindicatoralt_months')
                  .then(options => options?.profileindicatoralt_months ?? 12);

            default:
              console.warn('Unknown action ' + request.data.action + '.');
              return 'unknownAction';
          }
        })
        .then(data => {
          var response = {
            data,
            requestId: request.id,
            prefix: (request.prefix || 'TWPT'),
          };

          window.postMessage(response, '*');
        });
  });
}
setUpListener();

injectScript(chrome.runtime.getURL('profileIndicatorInject.bundle.js'));
injectStylesheet(chrome.runtime.getURL('css/profileindicator_inject.css'));
