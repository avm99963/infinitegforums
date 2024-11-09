import Script, { ScriptEnvironment, ScriptPage, ScriptRunPhase } from "../../../common/architecture/scripts/Script"
import { injectScript } from "../../../common/contentScriptsUtils";

export default class InjectLitComponentsScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Main;

  execute() {
    injectScript(chrome.runtime.getURL('litComponentsInject.bundle.js'));
  }
}
