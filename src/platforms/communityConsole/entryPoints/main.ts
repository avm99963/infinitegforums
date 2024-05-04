import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import Features from '../../../features/Features';
import ScriptRunner from '../../../common/architecture/scripts/ScriptRunner';

// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/main';

const features = new Features();
const scripts = features.getScripts({
  page: ScriptPage.CommunityConsole,
  environment: ScriptEnvironment.ContentScript,
  runPhase: ScriptRunPhase.Main,
});

const scriptRunner = new ScriptRunner();
scriptRunner.add(...scripts);
scriptRunner.run();
