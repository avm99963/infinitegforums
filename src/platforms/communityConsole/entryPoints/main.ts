import EntrypointScriptRunner from '../../../common/architecture/entrypoint/EntrypointScriptRunner';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';

// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/main';

const runner = new EntrypointScriptRunner({
  page: ScriptPage.CommunityConsole,
  environment: ScriptEnvironment.ContentScript,
  runPhase: ScriptRunPhase.Main,
});
runner.run();
