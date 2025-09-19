import DependenciesProviderSingleton, {
  AutoRefreshDependency,
  ExtraInfoDependency,
  OptionsProviderDependency,
  StartupDataStorageDependency,
  ThreadPageDesignWarningDependency,
  WorkflowsImportDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import AutoRefreshSetUpScript from '../../../features/autoRefresh/presentation/scripts/setUp.script';
import CCDarkThemeInjectAutoDarkTheme from '../../../features/ccDarkTheme/presentation/scripts/injectAutoDarkTheme.script';
import CCDarkThemeInjectForcedDarkTheme from '../../../features/ccDarkTheme/presentation/scripts/injectForcedDarkTheme.script';
import InteropThreadPageSetupScript from '../../../features/interopThreadPage/presentation/scripts/setup.script';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import LoadDraftsSetupScript from '../../../features/loadDrafts/presentation/scripts/setup.script';
import WorkflowsImportSetUpScript from '../../../features/workflows/presentation/scripts/importSetUp.script';
import CCExtraInfoSetUpScript from '../../../features/extraInfo/presentation/scripts/ccExtraInfoSetUp.script';
import MWI18nServerScript from '../../../presentation/standaloneScripts/mainWorldServers/MWI18nServerScript.script';
import MWOptionsWatcherServerScript from '../../../presentation/standaloneScripts/mainWorldServers/MWOptionsWatcherServerScript.script';
import ApplyStartupDataModificationsOnStartScript from '../../../presentation/standaloneScripts/startupDataStorage/applyStartupDataModificationsOnStart.script';
import ThreadPageDesignWarningSetUpScript from '../../../features/threadPageDesignWarning/presentation/scripts/setUp.script';
import FlattenThreadsSetUpReplyActionHandlerScript from '../../../features/flattenThreads/presentation/scripts/setUpReplyActionHandler.script';
import FlattenThreadsReplyActionHandler from '../../../features/flattenThreads/core/replyActionHandler';
import UiSpacingSharedStylesScript from '../../../features/uiSpacing/presentation/scripts/sharedStyles.script';
import UiSpacingConsoleStylesScript from '../../../features/uiSpacing/presentation/scripts/consoleStyles.script';

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
  const threadPageDesignWarning = dependenciesProvider.getDependency(
    ThreadPageDesignWarningDependency,
  );
  const workflowsImport = dependenciesProvider.getDependency(
    WorkflowsImportDependency,
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Individual feature scripts
        new AutoRefreshSetUpScript(autoRefresh),
        new CCDarkThemeInjectAutoDarkTheme(optionsProvider),
        new CCDarkThemeInjectForcedDarkTheme(optionsProvider),
        new CCExtraInfoSetUpScript(extraInfo),
        new FlattenThreadsSetUpReplyActionHandlerScript(
          new FlattenThreadsReplyActionHandler(optionsProvider),
        ),
        new InteropThreadPageSetupScript(optionsProvider, startupDataStorage),
        new ThreadPageDesignWarningSetUpScript(threadPageDesignWarning),
        new LoadDraftsSetupScript(optionsProvider, startupDataStorage),
        new UiSpacingConsoleStylesScript(optionsProvider),
        new UiSpacingSharedStylesScript(optionsProvider),
        new WorkflowsImportSetUpScript(workflowsImport),

        // Standalone scripts
        new ApplyStartupDataModificationsOnStartScript(startupDataStorage),
        new MWI18nServerScript(),
        new MWOptionsWatcherServerScript(),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
