import DependenciesProviderSingleton, {
  AutoRefreshDependency,
  ExtraInfoDependency,
  OptionsProviderDependency,
  StartupDataStorageDependency,
  ThreadPageDesignWarningDependency,
  WorkflowsImportDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import AutoRefreshThreadListHideHandler from '../../../features/autoRefresh/presentation/nodeWatcherHandlers/threadListHide.handler';
import AutoRefreshThreadListSetUpHandler from '../../../features/autoRefresh/presentation/nodeWatcherHandlers/threadListSetUp.handler';
import AutoRefreshStylesScript from '../../../features/autoRefresh/presentation/scripts/styles.script';
import ReportDialogColorThemeFix from '../../../features/ccDarkTheme/core/logic/reportDialog';
import CCDarkThemeEcAppHandler from '../../../features/ccDarkTheme/presentation/nodeWatcherHandlers/ecApp.handler';
import CCDarkThemeReportDialogHandler from '../../../features/ccDarkTheme/presentation/nodeWatcherHandlers/reportDialog.handler';
import CCDarkThemeUnifiedProfilesIframeHandler from '../../../features/ccDarkTheme/presentation/nodeWatcherHandlers/unifiedProfilesIframe.handler';
import CCInfiniteScroll from '../../../features/infiniteScroll/core/ccInfiniteScroll';
import { NodeWatcherAdapter } from '../../../infrastructure/presentation/nodeWatcher/NodeWatcher.adapter';
import NodeWatcherScriptAdapter from '../../../infrastructure/presentation/scripts/NodeWatcherScript.adapter';
import ScriptRunner from '../../../infrastructure/presentation/scripts/ScriptRunner';
import ScriptSorterAdapter from '../../../infrastructure/presentation/scripts/ScriptSorter.adapter';
import { SortedScriptsProviderAdapter } from '../../../infrastructure/presentation/scripts/SortedScriptsProvider.adapter';
import { NodeWatcherHandler } from '../../../presentation/nodeWatcher/NodeWatcherHandler';
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
import ThreadPageDesignWarningInjectHandler from '../../../features/threadPageDesignWarning/presentation/nodeWatcherHandlers/inject.handler';
import FlattenThreadsAdditionalInfoHandler from '../../../features/flattenThreads/presentation/nodeWatcherHandlers/additionalInfo.handler';
import FlattenThreadsQuoteHandler from '../../../features/flattenThreads/presentation/nodeWatcherHandlers/quote.handler';
import FlattenThreadsReaddReplyBtnHandler from '../../../features/flattenThreads/presentation/nodeWatcherHandlers/readdReplyBtn.handler';
import FlattenThreadsReplyBtnHandler from '../../../features/flattenThreads/presentation/nodeWatcherHandlers/replyBtn.handler';
import FlattenThreads from '../../../features/flattenThreads/core/flattenThreads';
import FixedToolbarStylesScript from '../../../features/fixedToolbar/presentation/scripts/styles.script';
import EnhancedAnnouncementsDotStylesScript from '../../../features/enhancedAnnouncementsDot/presentation/scripts/styles.script';
import ImageMaxHeightStylesScript from '../../../features/imageMaxHeight/presentation/scripts/styles.script';
import RepositionExpandThreadStylesScript from '../../../features/repositionExpandThread/presentation/scripts/styles.script';
import StickySidebarHeadersStylesScript from '../../../features/stickySidebarHeaders/presentation/scripts/styles.script';
import IncreaseContrastStylesScript from '../../../features/increaseContrast/presentation/scripts/styles.script';
import BulkReportRepliesMessageCardHandler from '../../../features/bulkReportReplies/presentation/nodeWatcherHandlers/messageCard.handler';
import BulkReportRepliesHandleBodyClassScript from '../../../features/bulkReportReplies/presentation/scripts/handleBodyClass.script';
import { IsBulkReportRepliesFeatureEnabledServiceAdapter } from '../../../features/bulkReportReplies/services/isFeatureEnabled.service';
import BulkReportRepliesStylesScript from '../../../features/bulkReportReplies/presentation/scripts/styles.script';
import BulkReportRepliesKeyboardShortcutScript from '../../../features/bulkReportReplies/presentation/scripts/keyboardShortcut.script';
import { OptionsModifierAdapter } from '../../../infrastructure/services/options/OptionsModifier.adapter';
import ThreadToolbarInjectHandler from '../../../features/threadToolbar/presentation/nodeWatcherHandlers/inject.handler';
import ThreadToolbar from '../../../features/threadToolbar/core/threadToolbar';
import { BulkReportControlsInjectorAdapter } from '../../../features/bulkReportReplies/infrastructure/ui/injectors/bulkReportControls.injector.adapter';
import { MessageInfoRepositoryAdapter } from '../../../features/bulkReportReplies/infrastructure/repositories/messageInfo/messageInfo.repository.adapter';
import { ReportOffTopicRepositoryAdapter } from '../../../features/bulkReportReplies/infrastructure/repositories/api/reportOffTopic/reportOffTopic.repository.adapter';
import { ReportAbuseRepositoryAdapter } from '../../../features/bulkReportReplies/infrastructure/repositories/api/reportAbuse/reportAbuse.repository.adapter';
import BatchLockBulkActionsHandler from '../../../features/batchLock/presentation/nodeWatcherHandlers/bulkActions.handler';
import BatchLockInjectScript from '../../../features/batchLock/presentation/scripts/inject.script';
import BatchLockStylesScript from '../../../features/batchLock/presentation/scripts/styles.script';
import { BatchLockButtonInjectorAdapter } from '../../../features/batchLock/infrastructure/ui/injectors/batchLockButton.injector.adapter';
import { CCThreadListGenericActionButtonInjectorAdapter } from '../../../infrastructure/ui/injectors/communityConsole/threadListGenericActionButton.injector.adapter';
import { CCThreadListActionInjectorAdapter } from '../../../infrastructure/ui/injectors/communityConsole/threadListAction.injector.adapter';
import BulkMoveBulkActionsHandler from '../../../features/bulkMove/presentation/nodeWatchHandlers/bulkActions.handler';
import { BulkMoveButtonInjectorAdapter } from '../../../features/bulkMove/infrastructure/ui/injectors/bulkMoveButton.injector.adapter';
import { GetSelectedThreadsServiceAdapter } from '../../../infrastructure/ui/services/communityConsole/getSelectedThreads.service.adapter';
import { UrlThreadDataParserServiceAdapter } from '../../../infrastructure/ui/services/communityConsole/urlThreadDataParser.service.adapter';
import { BulkMoveThreadsRepositoryAdapter } from '../../../features/bulkMove/infrastructure/repositories/api/moveThread.repository.adapter';
import { ViewSoftRefresherServiceAdapter } from '../../../infrastructure/ui/services/communityConsole/viewSoftRefresher.service.adapter';
import CCForceHideDrawerScript from '../../../features/ccForceHideDrawer/presentation/hideDrawer.script';
// #!if browser_target == 'chromium_mv3'
import CCDragAndDropFixTextEditorHandler from '../../../features/ccDragAndDropFix/presentation/nodeWatcherHandlers/fixTextEditor.handler';
// #!endif
import ThreadToolbarStylesScript from '../../../features/threadToolbar/presentation/nodeWatcherHandlers/styles.handler';
import PreviousPostsInjectHandler from '../../../features/previousPosts/presentation/handlers/inject.handler';
import AvatarsInjectHandler from '../../../features/avatars/presentation/nodeWatcherHandlers/inject.script';
import AvatarsStylesScript from '../../../features/avatars/presentation/scripts/styles.script';
import AvatarsHandler from '../../../features/avatars/core/avatars';
import XHRInterceptorSetUpKillSwitchHandler from '../../../presentation/standaloneScripts/xhrInterceptor/setUpKillSwitchHandler.script';

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

  const ccThreadListGenericActionButtonInjector =
    new CCThreadListGenericActionButtonInjectorAdapter(
      new CCThreadListActionInjectorAdapter(),
    );
  const optionsModifier = new OptionsModifierAdapter();

  const avatarsHandler = new AvatarsHandler();
  const ccInfiniteScroll = new CCInfiniteScroll();
  const flattenThreads = new FlattenThreads();

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
            ['avatarsInject', new AvatarsInjectHandler(avatarsHandler)],
            [
              'batchLockBulkActions',
              new BatchLockBulkActionsHandler(
                optionsProvider,
                new BatchLockButtonInjectorAdapter(
                  ccThreadListGenericActionButtonInjector,
                ),
              ),
            ],
            [
              'bulkMoveBulkActions',
              new BulkMoveBulkActionsHandler(
                optionsProvider,
                new BulkMoveButtonInjectorAdapter(
                  ccThreadListGenericActionButtonInjector,
                  startupDataStorage,
                  new GetSelectedThreadsServiceAdapter(
                    new UrlThreadDataParserServiceAdapter(),
                  ),
                  new ViewSoftRefresherServiceAdapter(),
                  new BulkMoveThreadsRepositoryAdapter(),
                ),
              ),
            ],
            [
              'bulkReportRepliesMessageCard',
              new BulkReportRepliesMessageCardHandler(
                optionsProvider,
                new BulkReportControlsInjectorAdapter(
                  new MessageInfoRepositoryAdapter(),
                  new ReportOffTopicRepositoryAdapter(),
                  new ReportAbuseRepositoryAdapter(),
                ),
              ),
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
            // #!if browser_target == 'chromium_mv3'
            [
              'ccDragAndDropFixTextEditor',
              new CCDragAndDropFixTextEditorHandler(optionsProvider),
            ],
            // #!endif
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
              'flattenThreadsAdditionalInfo',
              new FlattenThreadsAdditionalInfoHandler(flattenThreads),
            ],
            [
              'flattenThreadsQuote',
              new FlattenThreadsQuoteHandler(flattenThreads),
            ],
            [
              'flattenThreadsReaddReplyBtn',
              new FlattenThreadsReaddReplyBtnHandler(flattenThreads),
            ],
            [
              'flattenThreadsReplyBtn',
              new FlattenThreadsReplyBtnHandler(flattenThreads),
            ],
            [
              'previousPostsInject',
              new PreviousPostsInjectHandler(optionsProvider),
            ],
            [
              'threadPageDesignWarningInject',
              new ThreadPageDesignWarningInjectHandler(threadPageDesignWarning),
            ],
            [
              'threadToolbar',
              new ThreadToolbarInjectHandler(
                new ThreadToolbar(optionsProvider, optionsModifier),
              ),
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
        new AvatarsStylesScript(),
        new BatchLockInjectScript(),
        new BatchLockStylesScript(),
        new BulkReportRepliesHandleBodyClassScript(
          optionsProvider,
          new IsBulkReportRepliesFeatureEnabledServiceAdapter(),
        ),
        new BulkReportRepliesKeyboardShortcutScript(
          optionsProvider,
          optionsModifier,
        ),
        new BulkReportRepliesStylesScript(),
        new CCExtraInfoInjectScript(),
        new CCExtraInfoStylesScript(),
        new CCForceHideDrawerScript(optionsProvider),
        new EnhancedAnnouncementsDotStylesScript(),
        new FixedToolbarStylesScript(),
        new ImageMaxHeightStylesScript(),
        new IncreaseContrastStylesScript(),
        new RepositionExpandThreadStylesScript(),
        new StickySidebarHeadersStylesScript(),
        new ThreadToolbarStylesScript(),
        new WorkflowsImportStylesheetScript(),

        // Standalone scripts
        new ApplyStartupDataModificationsOnMainScript(startupDataStorage),
        new InjectLitComponentsScript(),
        new XHRInterceptorSetUpKillSwitchHandler(),
      ],
      new ScriptSorterAdapter(),
    ).getScripts(),
  );
}
