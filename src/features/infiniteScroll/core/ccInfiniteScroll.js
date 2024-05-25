import {getOptions, isOptionEnabled} from '../../../common/options/optionsUtils.js';

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
  constructor() {
    this.intersectionObserver = null;
  }

  setUpIntersectionObserver(node, isScrollableContent) {
    if (this.intersectionObserver === null) {
      var scrollableContent = isScrollableContent ?
          node :
          node.querySelector('.scrollable-content');
      if (scrollableContent !== null) {
        let intersectionOptions = {
          root: scrollableContent,
          rootMargin: '0px',
          threshold: 1.0,
        };
        this.intersectionObserver = new IntersectionObserver(
            this.intersectionCallback, intersectionOptions);
      }
    }
  }

  intersectionCallback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.debug('[infinitescroll] Clicking button: ', entry.target);
        entry.target.click();
      }
    });
  }

  isPotentiallyArtificialScroll() {
    return window.location.href.includes('/message/');
  }

  observeWithPotentialDelay(node) {
    if (this.intersectionObserver === null) {
      console.warn(
          '[infinitescroll] ' +
          'The intersectionObserver is not ready yet.');
      return;
    }

    if (this.isPotentiallyArtificialScroll()) {
      window.setTimeout(
          () => {this.intersectionObserver.observe(node)},
          kArtificialScrollingDelay);
    } else {
      this.intersectionObserver.observe(node);
    }
  }

  observeLoadMoreBar(bar) {
    getOptions(['thread', 'threadall']).then(threadOptions => {
      if (threadOptions.thread)
        this.observeWithPotentialDelay(bar.querySelector('.load-more-button'));
      if (threadOptions.threadall)
        this.observeWithPotentialDelay(bar.querySelector('.load-all-button'));
    });
  }

  observeLoadMoreInteropBtn(btn) {
    let parentClasses = btn.parentNode?.classList;
    let feature = null;
    for (const [c, f] of Object.entries(kInteropLoadMoreClasses)) {
      if (parentClasses?.contains?.(c)) {
        feature = f;
        break;
      }
    }
    if (feature === null) return;
    isOptionEnabled(feature).then(isEnabled => {
      if (isEnabled) this.observeWithPotentialDelay(btn);
    });
  }
};
