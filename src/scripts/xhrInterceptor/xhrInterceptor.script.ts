import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../common/architecture/scripts/Script';
import { injectScript } from '../../common/contentScriptsUtils';

export default class XHRInterceptorScript extends Script {
  priority = 10;

  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Start;

  execute() {
    injectScript(
      chrome.runtime.getURL('xhrInterceptorInject.bundle.js'),
      /* prepend = */ true,
    );
  }
}
