// Run legacy Javascript entry point
import '../../../contentScripts/communityConsole/main';

import DependenciesProviderSingleton, {
  AutoRefreshDependency,
  OptionsProviderDependency,
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
import CCDarkThemeEcAppHandler from '../../../features/ccDarkTheme/nodeWatcherHandlers/ecApp.handler';
import CCDarkThemeReportDialogHandler from '../../../features/ccDarkTheme/nodeWatcherHandlers/reportDialog.handler';
import CCDarkThemeUnifiedProfilesIframeHandler from '../../../features/ccDarkTheme/nodeWatcherHandlers/unifiedProfilesIframe.handler';
import Features from '../../../features/Features';
import CCInfiniteScroll from '../../../features/infiniteScroll/core/ccInfiniteScroll';
import { NodeWatcherAdapter } from '../../../infrastructure/presentation/nodeWatcher/NodeWatcher.adapter';
import NodeWatcherScriptAdapter from '../../../infrastructure/presentation/scripts/NodeWatcherScript.adapter';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import { NodeWatcherHandler } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
import StandaloneScripts from '../../../scripts/Scripts';
import CCInfiniteScrollSetUpHandler from '../../../features/infiniteScroll/nodeWatcherHandlers/ccInfiniteScrollSetUp.handler';
import CCInfiniteScrollLoadMoreBarHandler from '../../../features/infiniteScroll/nodeWatcherHandlers/ccInfiniteScrollLoadMoreBar.handler';
import CCInfiniteScrollLoadMoreBtnHandler from '../../../features/infiniteScroll/nodeWatcherHandlers/ccInfiniteScrollLoadMoreBtn.handler';

const scriptRunner = createScriptRunner();
scriptRunner.run();

function createScriptRunner() {
  const dependenciesProvider = DependenciesProviderSingleton.getInstance();
  const autoRefresh = dependenciesProvider.getDependency(AutoRefreshDependency);
  const optionsProvider = dependenciesProvider.getDependency(
    OptionsProviderDependency,
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
          ]),
        ),

        // Individual feature scripts
        new AutoRefreshStylesScript(),

        // Non-DI scripts (legacy, should be migrated to use a DI approach)
        ...new Features().getScripts(context),
        ...new StandaloneScripts().getScripts(context),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
