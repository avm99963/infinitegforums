import Script from '../../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../../common/contentScriptsUtils';

export default class CCExtraInfoStylesScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/extrainfo.css'));
    injectStylesheet(chrome.runtime.getURL('css/extrainfo_perforumstats.css'));
  }
}
