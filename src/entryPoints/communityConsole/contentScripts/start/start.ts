import DependenciesProviderSingleton, {
  AutoRefreshDependency,
  ExtraInfoDependency,
  StartupDataStorageDependency,
  ThreadPageDesignWarningDependency,
  WorkflowsImportDependency,
} from '../../../../common/architecture/dependenciesProvider/DependenciesProvider';
import AutoRefreshSetUpScript from '../../../../features/autoRefresh/presentation/scripts/setUp.script';
import CCDarkThemeInjectAutoDarkTheme from '../../../../features/ccDarkTheme/presentation/scripts/injectAutoDarkTheme.script';
import CCDarkThemeInjectForcedDarkTheme from '../../../../features/ccDarkTheme/presentation/scripts/injectForcedDarkTheme.script';
import InteropThreadPageSetupScript from '../../../../features/interopThreadPage/presentation/scripts/setup.script';
import ScriptRunner from '../../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import LoadDraftsSetupScript from '../../../../features/loadDrafts/presentation/scripts/setup.script';
import WorkflowsImportSetUpScript from '../../../../features/workflows/presentation/scripts/importSetUp.script';
import CCExtraInfoSetUpScript from '../../../../features/extraInfo/presentation/scripts/ccExtraInfoSetUp.script';
import MWI18nServerScript from '../../../../presentation/standaloneScripts/mainWorldServers/MWI18nServerScript.script';
import ApplyStartupDataModificationsOnStartScript from '../../../../presentation/standaloneScripts/startupDataStorage/applyStartupDataModificationsOnStart.script';
import ThreadPageDesignWarningSetUpScript from '../../../../features/threadPageDesignWarning/presentation/scripts/setUp.script';
import FlattenThreadsSetUpReplyActionHandlerScript from '../../../../features/flattenThreads/presentation/scripts/setUpReplyActionHandler.script';
import FlattenThreadsReplyActionHandler from '../../../../features/flattenThreads/core/replyActionHandler';
import UiSpacingSharedStylesScript from '../../../../features/uiSpacing/presentation/scripts/sharedStyles.script';
import UiSpacingConsoleStylesScript from '../../../../features/uiSpacing/presentation/scripts/consoleStyles.script';
import OptionsProviderAdapter from '../../../../infrastructure/services/options/OptionsProvider.adapter';
import { OptionsConfigurationRepositoryAdapter } from '../../../../options/infrastructure/repositories/OptionsConfiguration.repository.adapter';
import MWOptionsConfigurationRepositoryServerScript from '../../../../presentation/standaloneScripts/mainWorldServers/MWOptionsConfigurationRepositoryServerScript.script';
import ExtraInfo from '@/features/extraInfo/core';
import AutoRefresh from '@/features/autoRefresh/core/autoRefresh';
import StartupDataStorageAdapter from '@/infrastructure/services/communityConsole/StartupDataStorage.adapter';
import ThreadPageDesignWarning from '@/features/threadPageDesignWarning/core/threadPageDesignWarning';
import WorkflowsImport from '@/features/workflows/core/communityConsole/import/import';
import FixStartupDataScript from '@/features/fixPEKB381989895/presentation/scripts/fixStartupData.script';
import { getSyncStorageAreaRepository } from '@/storage/compositionRoot';
import BatchLockSetUpContentScriptListenerScript from '@/features/batchLock/presentation/scripts/setUpContentScriptListener.script';
import SimulateRolesScript from '@/features/simulateRoles/presentation/scripts/simulateRoles.script';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const optionsConfigurationRepository =
    new OptionsConfigurationRepositoryAdapter(getSyncStorageAreaRepository());
  const optionsProvider = new OptionsProviderAdapter(
    optionsConfigurationRepository,
  );

  const dependenciesProvider = DependenciesProviderSingleton.getInstance();
  const autoRefresh = dependenciesProvider.getDependency(
    AutoRefreshDependency,
    () => new AutoRefresh(),
  );
  const extraInfo = dependenciesProvider.getDependency(
    ExtraInfoDependency,
    () => new ExtraInfo(optionsProvider),
  );
  const startupDataStorage = dependenciesProvider.getDependency(
    StartupDataStorageDependency,
    () => new StartupDataStorageAdapter(),
  );
  const threadPageDesignWarning = dependenciesProvider.getDependency(
    ThreadPageDesignWarningDependency,
    () => new ThreadPageDesignWarning(),
  );
  const workflowsImport = dependenciesProvider.getDependency(
    WorkflowsImportDependency,
    () => new WorkflowsImport(),
  );

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Individual feature scripts
        new AutoRefreshSetUpScript(autoRefresh),
        new BatchLockSetUpContentScriptListenerScript(),
        new CCDarkThemeInjectAutoDarkTheme(optionsProvider),
        new CCDarkThemeInjectForcedDarkTheme(optionsProvider),
        new CCExtraInfoSetUpScript(extraInfo),
        new FixStartupDataScript(optionsProvider, startupDataStorage),
        new FlattenThreadsSetUpReplyActionHandlerScript(
          new FlattenThreadsReplyActionHandler(optionsProvider),
        ),
        new InteropThreadPageSetupScript(optionsProvider, startupDataStorage),
        new SimulateRolesScript(optionsProvider, startupDataStorage),
        new ThreadPageDesignWarningSetUpScript(threadPageDesignWarning),
        new LoadDraftsSetupScript(optionsProvider, startupDataStorage),
        new UiSpacingConsoleStylesScript(optionsProvider),
        new UiSpacingSharedStylesScript(optionsProvider),
        new WorkflowsImportSetUpScript(workflowsImport),

        // Standalone scripts
        new ApplyStartupDataModificationsOnStartScript(startupDataStorage),
        new MWI18nServerScript(),
        new MWOptionsConfigurationRepositoryServerScript(
          optionsConfigurationRepository,
        ),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
