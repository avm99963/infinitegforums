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

  observeWithPotentialDelay(node: Element) {
    if (this.intersectionObserver === null) {
      console.warn(
        '[infinitescroll] The intersectionObserver is not ready yet.',
      );
      return;
    }

    if (this.isPotentiallyArtificialScroll()) {
      window.setTimeout(() => {
        this.intersectionObserver.observe(node);
      }, kArtificialScrollingDelay);
    } else {
      this.intersectionObserver.observe(node);
    }
  }

  observeLoadMoreBar(bar: Element) {
    getOptions(['thread', 'threadall']).then((threadOptions) => {
      if (threadOptions.thread)
        this.observeWithPotentialDelay(bar.querySelector('.load-more-button'));
      if (threadOptions.threadall)
        this.observeWithPotentialDelay(bar.querySelector('.load-all-button'));
    });
  }

  observeLoadMoreInteropBtn(btn: Element) {
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
}
