import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import MWOptionsWatcherServer from '../../mainWorldContentScriptBridge/optionsWatcher/Server';
import {
  kCSTarget,
  kMWTarget,
} from '../../../xhrInterceptor/responseModifier/ResponseModifier.adapter';

export default class MWOptionsWatcherServerScript extends Script {
  // The server should be available as soon as possible, since e.g. the
  // XHRProxy already sends a request to the optionsWatcher server as soon as it
  // is constructed.
  priority = 0;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  execute() {
    const server = new MWOptionsWatcherServer(kCSTarget, kMWTarget);
    server.register();
  }
}
