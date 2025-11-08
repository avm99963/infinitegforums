import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import XHRProxyKillSwitchHandler from '../../../xhrInterceptor/killSwitchHandler/killSwitchHandler';

export default class XHRInterceptorSetUpKillSwitchHandler extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.InjectedScript;
  runPhase = ScriptRunPhase.Main;

  // TODO: Refactor this to the DI architecture. It will need changes to the
  // classes being initialized here.
  execute() {
    new XHRProxyKillSwitchHandler();
  }
}
