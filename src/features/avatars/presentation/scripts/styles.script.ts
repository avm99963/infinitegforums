import Script from '../../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../../common/contentScriptsUtils';

export default class AvatarsStylesScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/thread_list_avatars.css'));
  }
}
