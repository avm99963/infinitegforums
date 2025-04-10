import Script from '../../../../common/architecture/scripts/Script';
import { injectScript } from '../../../../common/contentScriptsUtils';

export default class BatchLockInjectScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectScript(chrome.runtime.getURL('batchLockInject.bundle.js'));
  }
}
