import Script, { ScriptEnvironment, ScriptPage, ScriptRunPhase } from "../../../common/architecture/scripts/Script"
import MWI18nServer from "../../../common/mainWorldI18n/Server";

export default class MWI18nServerScript extends Script {
  // The server should be available as soon as possible, since e.g. the
  // XHRProxy already sends a request to the optionsWatcher server as soon as it
  // is constructed.
  priority = 1;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  execute() {
    new MWI18nServer();
  }
}
