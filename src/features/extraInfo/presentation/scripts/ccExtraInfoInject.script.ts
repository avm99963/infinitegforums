import Script from '../../../../common/architecture/scripts/Script';
import { injectScript } from '../../../../common/contentScriptsUtils';

export default class CCExtraInfoInjectScript extends Script {
  priority = 11;

  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectScript(chrome.runtime.getURL('extraInfoInject.bundle.js'));
  }
}
