import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import { injectStylesheet } from '../../../common/contentScriptsUtils';

export default class AutoRefreshStylesScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Main;

  execute() {
    injectStylesheet(chrome.runtime.getURL('css/autorefresh_list.css'));
  }
}
