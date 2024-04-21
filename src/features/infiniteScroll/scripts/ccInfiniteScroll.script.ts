import {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import NodeWatcherScript from '../../../common/architecture/scripts/nodeWatcher/NodeWatcherScript';
import CCInfiniteScroll from '../core/ccInfiniteScroll';
import CCInfiniteScrollLoadMoreBarHandler from '../nodeWatcherHandlers/ccInfiniteScrollLoadMoreBar.handler';
import CCInfiniteScrollLoadMoreBtnHandler from '../nodeWatcherHandlers/ccInfiniteScrollLoadMoreBtn.handler';
import CCInfiniteScrollSetUpHandler from '../nodeWatcherHandlers/ccInfiniteScrollSetUp.handler';

export interface InfiniteScrollNodeWatcherOptions {
  ccInfiniteScroll: CCInfiniteScroll;
}

export default class CCInfiniteScrollScript extends NodeWatcherScript<InfiniteScrollNodeWatcherOptions> {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.ContentScript;
  runPhase = ScriptRunPhase.Main;
  handlers = new Map([
    ['ccInfiniteScrollSetUp', CCInfiniteScrollSetUpHandler],
    ['ccInfiniteScrollLoadMoreBar', CCInfiniteScrollLoadMoreBarHandler],
    ['ccInfiniteScrollLoadMoreBtn', CCInfiniteScrollLoadMoreBtnHandler],
  ]);

  protected optionsFactory(): InfiniteScrollNodeWatcherOptions {
    return {
      ccInfiniteScroll: new CCInfiniteScroll(),
    };
  }
}
