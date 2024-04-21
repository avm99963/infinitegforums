import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import Features from '../../../features/Features';

// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/start';

const features = new Features();
features.runScripts({
  page: ScriptPage.CommunityConsole,
  environment: ScriptEnvironment.ContentScript,
  runPhase: ScriptRunPhase.Start,
});
