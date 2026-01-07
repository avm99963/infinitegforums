import Script from '@/common/architecture/scripts/Script';

// TODO(https://iavm.xyz/b/twpowertools/226): Switch users of this listener to
// use ChromeI18nPort with the main world to content script bridge adapter.

/**
 * This is a deprecated way of passing i18n strings and settings values to the
 * injected scripts, which don't have access to the chrome.* APIs.
 *
 * @deprecated
 */
export default class BatchLockSetUpContentScriptListenerScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    window.addEventListener('TWPT_sendRequest', (evt: any) => {
      var request = evt.detail;

      Promise.resolve(null)
        .then(() => {
          switch (request.data.action) {
            case 'geti18nMessage':
              return chrome.i18n.getMessage(
                request.data.msg,
                Array.isArray(request.data.placeholders)
                  ? request.data.placeholders
                  : [],
              );

            default:
              console.warn('Unknown action ' + request.data.action + '.');
              return 'unknownAction';
          }
        })
        .then((data) => {
          var response = {
            data,
            requestId: request.id,
            prefix: request.prefix || 'TWPT',
          };

          window.postMessage(response, '*');
        });
    });
  }
}
