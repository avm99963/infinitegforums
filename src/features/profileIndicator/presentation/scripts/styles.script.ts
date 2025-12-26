import Script from "@/common/architecture/scripts/Script";
import { injectStylesheet } from "@/common/contentScriptsUtils";

export default class ProfileIndicatorStylesScript extends Script {
  page: never;
  environment: never;
  runPhase: never;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/profileindicator_inject.css'));
  }
}
