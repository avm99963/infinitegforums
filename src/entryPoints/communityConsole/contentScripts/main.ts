// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/main';

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
import AutoRefreshThreadListHideHandler from '../../../features/autoRefresh/presentation/nodeWatcherHandlers/threadListHide.handler';
import AutoRefreshThreadListSetUpHandler from '../../../features/autoRefresh/presentation/nodeWatcherHandlers/threadListSetUp.handler';
import AutoRefreshStylesScript from '../../../features/autoRefresh/presentation/scripts/styles.script';
import ReportDialogColorThemeFix from '../../../features/ccDarkTheme/core/logic/reportDialog';
import CCDarkThemeEcAppHandler from '../../../features/ccDarkTheme/presentation/nodeWatcherHandlers/ecApp.handler';
import CCDarkThemeReportDialogHandler from '../../../features/ccDarkTheme/presentation/nodeWatcherHandlers/reportDialog.handler';
import CCDarkThemeUnifiedProfilesIframeHandler from '../../../features/ccDarkTheme/presentation/nodeWatcherHandlers/unifiedProfilesIframe.handler';
import Features from '../../../features/Features';
import CCInfiniteScroll from '../../../features/infiniteScroll/core/ccInfiniteScroll';
import { NodeWatcherAdapter } from '../../../infrastructure/presentation/nodeWatcher/NodeWatcher.adapter';
import NodeWatcherScriptAdapter from '../../../infrastructure/presentation/scripts/NodeWatcherScript.adapter';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import { NodeWatcherHandler } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import StandaloneScripts from '../../../presentation/standaloneScripts/Scripts';
import CCInfiniteScrollSetUpHandler from '../../../features/infiniteScroll/presentation/nodeWatcherHandlers/ccInfiniteScrollSetUp.handler';
import CCInfiniteScrollLoadMoreBarHandler from '../../../features/infiniteScroll/presentation/nodeWatcherHandlers/ccInfiniteScrollLoadMoreBar.handler';
import CCInfiniteScrollLoadMoreBtnHandler from '../../../features/infiniteScroll/presentation/nodeWatcherHandlers/ccInfiniteScrollLoadMoreBtn.handler';
import WorkflowsThreadListActionBarHandler from '../../../features/workflows/presentation/nodeWatcherHandlers/threadListActionBar.handler';
import WorkflowsImportCRTagsHandler from '../../../features/workflows/presentation/nodeWatcherHandlers/crTags.handler';
import Workflows from '../../../features/workflows/core/communityConsole/workflows';
import WorkflowsImportStylesheetScript from '../../../features/workflows/presentation/scripts/importStylesheet';
import CCExtraInfoProfileAbuseChipsHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/profile/ccExtraInfoProfileAbuseChips.handler';
import CCExtraInfoProfilePerForumStatsHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/profile/ccExtraInfoProfilePerForumStats.handler';
import CCExtraInfoThreadCommentHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/thread/ccExtraInfoThreadComment.handler';
import CCExtraInfoThreadListHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/threadList/ccExtraInfoThreadList.handler';
import CCExtraInfoThreadListToolbeltHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/threadList/ccExtraInfoThreadListToolbelt.handler';
import CCExtraInfoThreadQuestionHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/thread/ccExtraInfoThreadQuestion.handler';
import CCExtraInfoThreadReplyHandler from '../../../features/extraInfo/presentation/nodeWatcherHandlers/thread/ccExtraInfoThreadReply.handler';
import CCExtraInfoInjectScript from '../../../features/extraInfo/presentation/scripts/ccExtraInfoInject.script';
import CCExtraInfoStylesScript from '../../../features/extraInfo/presentation/scripts/ccExtraInfoStyles.script';
import InjectLitComponentsScript from '../../../presentation/standaloneScripts/litComponents/injectLitComponents.script';
import ApplyStartupDataModificationsOnMainScript from '../../../presentation/standaloneScripts/startupDataStorage/applyStartupDataModificationsOnMain.script';

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

  const ccInfiniteScroll = new CCInfiniteScroll();

  const context: Context = {
    page: ScriptPage.CommunityConsole,
    environment: ScriptEnvironment.ContentScript,
    runPhase: ScriptRunPhase.Main,
  };

  return new ScriptRunner(
    new SortedScriptsProviderAdapter(
      [
        // Node watcher script with handlers
        new NodeWatcherScriptAdapter(
          new NodeWatcherAdapter(),
          new Map<string, NodeWatcherHandler>([
            [
              'autoRefreshThreadListSetUp',
              new AutoRefreshThreadListSetUpHandler(autoRefresh),
            ],
            [
              'autoRefreshThreadListHide',
              new AutoRefreshThreadListHideHandler(autoRefresh),
            ],
            ['ccDarkThemeEcApp', new CCDarkThemeEcAppHandler(optionsProvider)],
            [
              'ccDarkThemeReportDialog',
              new CCDarkThemeReportDialogHandler(
                optionsProvider,
                new ReportDialogColorThemeFix(),
              ),
            ],
            [
              'ccDarkThemeUnifiedProfilesIframe',
              new CCDarkThemeUnifiedProfilesIframeHandler(optionsProvider),
            ],
            [
              'ccExtraInfoProfile',
              new CCExtraInfoProfileAbuseChipsHandler(extraInfo),
            ],
            [
              'ccExtraInfoProfilePerForumStats',
              new CCExtraInfoProfilePerForumStatsHandler(extraInfo),
            ],
            [
              'ccExtraInfoThreadComment',
              new CCExtraInfoThreadCommentHandler(extraInfo),
            ],
            [
              'ccExtraInfoThreadList',
              new CCExtraInfoThreadListHandler(extraInfo),
            ],
            [
              'ccExtraInfoThreadListToolbelt',
              new CCExtraInfoThreadListToolbeltHandler(extraInfo),
            ],
            [
              'ccExtraInfoThreadQuestion',
              new CCExtraInfoThreadQuestionHandler(extraInfo),
            ],
            [
              'ccExtraInfoThreadReply',
              new CCExtraInfoThreadReplyHandler(extraInfo),
            ],
            [
              'ccInfiniteScrollSetUp',
              new CCInfiniteScrollSetUpHandler(ccInfiniteScroll),
            ],
            [
              'ccInfiniteScrollLoadMoreBar',
              new CCInfiniteScrollLoadMoreBarHandler(ccInfiniteScroll),
            ],
            [
              'ccInfiniteScrollLoadMoreBtn',
              new CCInfiniteScrollLoadMoreBtnHandler(ccInfiniteScroll),
            ],
            [
              'workflowsImportCRTags',
              new WorkflowsImportCRTagsHandler(workflowsImport),
            ],
            [
              'workflowsThreadListActionBar',
              new WorkflowsThreadListActionBarHandler(new Workflows()),
            ],
          ]),
        ),

        // Individual feature scripts
        new AutoRefreshStylesScript(),
        new CCExtraInfoInjectScript(),
        new CCExtraInfoStylesScript(),
        new WorkflowsImportStylesheetScript(),

        // Standalone scripts
        new ApplyStartupDataModificationsOnMainScript(startupDataStorage),
        new InjectLitComponentsScript(),

        // Non-DI scripts (legacy, should be migrated to use a DI approach)
        ...new Features().getScripts(context),
        ...new StandaloneScripts().getScripts(context),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
