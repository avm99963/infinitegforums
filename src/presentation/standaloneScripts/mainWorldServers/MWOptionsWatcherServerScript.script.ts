import Script, { ScriptEnvironment, ScriptPage, ScriptRunPhase } from "../../../common/architecture/scripts/Script"
import MWOptionsWatcherServer from "../../../common/mainWorldOptionsWatcher/Server"
import { kCSTarget, kMWTarget } from "../../../xhrInterceptor/ResponseModifier"

export default class MWOptionsWatcherServerScript extends Script {
  // The server should be available as soon as possible, since e.g. the
  // XHRProxy already sends a request to the optionsWatcher server as soon as it
  // is constructed.
  priority = 0;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  execute() {
    new MWOptionsWatcherServer(kCSTarget, kMWTarget);
  }
}
