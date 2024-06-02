import {
  getOptions,
  isOptionEnabled,
} from '../../../common/options/optionsUtils.js';

const kInteropLoadMoreClasses = {
  // New (interop) UI without nested replies
  'scTailwindThreadMorebuttonload-all': 'threadall',
  'scTailwindThreadMorebuttonload-more': 'thread',

  // New (interop) UI with nested replies
  'scTailwindThreadMessagegapload-all': 'threadall',
  'scTailwindThreadMessagegapload-more': 'thread',
};
const kArtificialScrollingDelay = 3500;

export default class CCInfiniteScroll {
  private intersectionObserver: IntersectionObserver = null;

  setUpIntersectionObserver(node: Element, isScrollableContent: boolean) {
    if (this.intersectionObserver === null) {
      const scrollableContent = isScrollableContent
        ? node
        : node.querySelector('.scrollable-content');
      if (scrollableContent !== null) {
        const intersectionOptions = {
          root: scrollableContent,
          rootMargin: '0px',
          threshold: 1.0,
        };
        this.intersectionObserver = new IntersectionObserver(
          this.intersectionCallback,
          intersectionOptions,
        );
      }
    }
  }

  intersectionCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target;
        if (!(target instanceof HTMLElement)) return;
        console.debug('[infinitescroll] Clicking button: ', target);
        target.click();
      }
    });
  }

  isPotentiallyArtificialScroll(): boolean {
    return window.location.href.includes('/message/');
  }

  observeLoadMoreBar(bar: Element) {
    console.debug('[infinitescroll] Found load more bar:', bar);
    getOptions(['thread', 'threadall']).then((threadOptions) => {
      if (threadOptions.thread) {
        this.observeWithPotentialDelay(bar.querySelector('.load-more-button'));
      }
      if (threadOptions.threadall) {
        this.observeWithPotentialDelay(bar.querySelector('.load-all-button'));
      }
    });
  }

  observeLoadMoreInteropBtn(btn: Element) {
    console.debug('[infinitescroll] Found load more interop button:', btn);
    const parentNode = btn.parentNode;
    if (!(parentNode instanceof Element)) return;
    const parentClasses = parentNode?.classList;
    let feature: string = null;
    for (const [c, f] of Object.entries(kInteropLoadMoreClasses)) {
      if (parentClasses?.contains?.(c)) {
        feature = f;
        break;
      }
    }
    if (feature === null) return;
    isOptionEnabled(feature).then((isEnabled) => {
      if (isEnabled) this.observeWithPotentialDelay(btn);
    });
  }

  private observeWithPotentialDelay(node: Element) {
    if (this.intersectionObserver === null) {
      console.warn(
        '[infinitescroll] The intersectionObserver is not ready yet.',
      );
      return;
    }

    if (this.isPotentiallyArtificialScroll()) {
      console.debug(
        `[infinitescroll] Delaying observing`,
        node,
        `due to potential artifical scroll.`,
      );
      window.setTimeout(() => {
        console.debug(
          '[infinitescroll] Starting to observe',
          node,
          'after delay.',
        );
        this.intersectionObserver.observe(node);
      }, kArtificialScrollingDelay);
    } else {
      console.debug(
        '[infinitescroll] Starting to observe',
        node,
        'without delay.',
      );
      this.intersectionObserver.observe(node);
    }
  }
}
