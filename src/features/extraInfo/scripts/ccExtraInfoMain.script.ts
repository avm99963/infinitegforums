import DependenciesProviderSingleton, {
  ExtraInfoDependency,
} from '../../../common/architecture/dependenciesProvider/DependenciesProvider';
import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import LegacyNodeWatcherScript from '../../../common/architecture/scripts/nodeWatcher/LegacyNodeWatcherScript';
import ExtraInfo from '../core';
import CCExtraInfoProfileAbuseChipsHandler from '../nodeWatcherHandlers/profile/ccExtraInfoProfileAbuseChips.handler';
import CCExtraInfoProfilePerForumStatsHandler from '../nodeWatcherHandlers/profile/ccExtraInfoProfilePerForumStats.handler';
import CCExtraInfoThreadCommentHandler from '../nodeWatcherHandlers/thread/ccExtraInfoThreadComment.handler';
import CCExtraInfoThreadListHandler from '../nodeWatcherHandlers/threadList/ccExtraInfoThreadList.handler';
import CCExtraInfoThreadListToolbeltHandler from '../nodeWatcherHandlers/threadList/ccExtraInfoThreadListToolbelt.handler';
import CCExtraInfoThreadQuestionHandler from '../nodeWatcherHandlers/thread/ccExtraInfoThreadQuestion.handler';
import CCExtraInfoThreadReplyHandler from '../nodeWatcherHandlers/thread/ccExtraInfoThreadReply.handler';

export interface CCExtraInfoMainOptions {
  extraInfo: ExtraInfo;
}

export default class CCExtraInfoMainScript extends LegacyNodeWatcherScript<CCExtraInfoMainOptions> {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Main;
  handlers = new Map([
    ['ccExtraInfoProfile', CCExtraInfoProfileAbuseChipsHandler],
    ['ccExtraInfoProfilePerForumStats', CCExtraInfoProfilePerForumStatsHandler],
    ['ccExtraInfoThreadComment', CCExtraInfoThreadCommentHandler],
    ['ccExtraInfoThreadList', CCExtraInfoThreadListHandler],
    ['ccExtraInfoThreadListToolbelt', CCExtraInfoThreadListToolbeltHandler],
    ['ccExtraInfoThreadQuestion', CCExtraInfoThreadQuestionHandler],
    ['ccExtraInfoThreadReply', CCExtraInfoThreadReplyHandler],
  ]);

  protected optionsFactory(): CCExtraInfoMainOptions {
    const dependenciesProvider = DependenciesProviderSingleton.getInstance();
    return {
      extraInfo: dependenciesProvider.getDependency(ExtraInfoDependency),
    };
  }
}
