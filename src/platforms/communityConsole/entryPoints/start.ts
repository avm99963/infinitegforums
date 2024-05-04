import EntrypointScriptRunner from '../../../common/architecture/entrypoint/EntrypointScriptRunner';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';

// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/start';

const runner = new EntrypointScriptRunner({
  page: ScriptPage.CommunityConsole,
  environment: ScriptEnvironment.ContentScript,
  runPhase: ScriptRunPhase.Start,
});
runner.run();
