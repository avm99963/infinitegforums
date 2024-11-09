import Script from '../../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../../common/contentScriptsUtils';

export default class FlattenThreadsStylesScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/flatten_threads.css'));
  }
}
