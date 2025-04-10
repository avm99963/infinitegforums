import Script from '../../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../../common/contentScriptsUtils';

export default class BatchLockStylesScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/batchlock_inject.css'));
  }
}
