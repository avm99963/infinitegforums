import DependenciesProviderSingleton, {
  AutoRefreshDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import { Context } from '../../../common/architecture/entrypoint/Context';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import AutoRefreshSetUpScript from '../../../features/autoRefresh/presentation/scripts/setUp.script';
import Features from '../../../features/Features';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import StandaloneScripts from '../../../scripts/Scripts';

// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/start';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const dependenciesProvider = DependenciesProviderSingleton.getInstance();
  const autoRefresh = dependenciesProvider.getDependency(AutoRefreshDependency);

  const context: Context = {
    page: ScriptPage.CommunityConsole,
    environment: ScriptEnvironment.ContentScript,
    runPhase: ScriptRunPhase.Start,
  };

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Individual feature scripts
        new AutoRefreshSetUpScript(autoRefresh),

        // Non-DI scripts (legacy, should be migrated to use a DI approach)
        ...new Features().getScripts(context),
        ...new StandaloneScripts().getScripts(context),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
