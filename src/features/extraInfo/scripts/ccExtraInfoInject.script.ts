import Script, { ScriptEnvironment, ScriptPage, ScriptRunPhase } from "../../../common/architecture/scripts/Script";
import { injectScript } from "../../../common/contentScriptsUtils";

export default class CCExtraInfoInjectScript extends Script {
  priority = 11;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  execute() {
    injectScript(chrome.runtime.getURL('extraInfoInject.bundle.js'));
  }
}
