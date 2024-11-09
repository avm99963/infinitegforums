// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/start';

import DependenciesProviderSingleton, {
  AutoRefreshDependency,
  ExtraInfoDependency,
  OptionsProviderDependency,
  StartupDataStorageDependency,
  WorkflowsImportDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import { Context } from '../../../common/architecture/entrypoint/Context';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import AutoRefreshSetUpScript from '../../../features/autoRefresh/presentation/scripts/setUp.script';
import CCDarkThemeInjectAutoDarkTheme from '../../../features/ccDarkTheme/presentation/scripts/injectAutoDarkTheme.script';
import CCDarkThemeInjectForcedDarkTheme from '../../../features/ccDarkTheme/presentation/scripts/injectForcedDarkTheme.script';
import Features from '../../../features/Features';
import InteropThreadPageSetupScript from '../../../features/interopThreadPage/presentation/scripts/setup.script';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import StandaloneScripts from '../../../presentation/standaloneScripts/Scripts';
import LoadDraftsSetupScript from '../../../features/loadDrafts/presentation/scripts/setup.script';
import WorkflowsImportSetUpScript from '../../../features/workflows/presentation/scripts/importSetUp.script';
import CCExtraInfoSetUpScript from '../../../features/extraInfo/presentation/scripts/ccExtraInfoSetUp.script';
import MWI18nServerScript from '../../../presentation/standaloneScripts/mainWorldServers/MWI18nServerScript.script';
import MWOptionsWatcherServerScript from '../../../presentation/standaloneScripts/mainWorldServers/MWOptionsWatcherServerScript.script';
import ApplyStartupDataModificationsOnStartScript from '../../../presentation/standaloneScripts/startupDataStorage/applyStartupDataModificationsOnStart.script';
import XHRInterceptorScript from '../../../presentation/standaloneScripts/xhrInterceptor/xhrInterceptor.script';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const dependenciesProvider = DependenciesProviderSingleton.getInstance();
  const autoRefresh = dependenciesProvider.getDependency(AutoRefreshDependency);
  const extraInfo = dependenciesProvider.getDependency(ExtraInfoDependency);
  const optionsProvider = dependenciesProvider.getDependency(
    OptionsProviderDependency,
  );
  const startupDataStorage = dependenciesProvider.getDependency(
    StartupDataStorageDependency,
  );
  const workflowsImport = dependenciesProvider.getDependency(
    WorkflowsImportDependency,
  );

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
        new CCDarkThemeInjectAutoDarkTheme(),
        new CCDarkThemeInjectForcedDarkTheme(),
        new CCExtraInfoSetUpScript(extraInfo),
        new InteropThreadPageSetupScript(),
        new LoadDraftsSetupScript(optionsProvider, startupDataStorage),
        new WorkflowsImportSetUpScript(workflowsImport),

        // Standalone scripts
        new ApplyStartupDataModificationsOnStartScript(startupDataStorage),
        new MWI18nServerScript(),
        new MWOptionsWatcherServerScript(),
        new XHRInterceptorScript(),

        // Non-DI scripts (legacy, should be migrated to use a DI approach)
        ...new Features().getScripts(context),
        ...new StandaloneScripts().getScripts(context),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
