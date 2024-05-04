import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../common/contentScriptsUtils';

export default class CCExtraInfoStylesScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Main;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/extrainfo.css'));
    injectStylesheet(chrome.runtime.getURL('css/extrainfo_perforumstats.css'));
  }
}
