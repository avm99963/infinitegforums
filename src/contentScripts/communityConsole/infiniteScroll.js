import {getOptions, isOptionEnabled} from '../../common/optionsUtils.js';

const kInteropLoadMoreClasses = {
  'scTailwindThreadMorebuttonload-all': 'threadall',
  'scTailwindThreadMorebuttonload-more': 'thread',
};

export default class InfiniteScroll {
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

  observeLoadMoreBar(bar) {
    if (this.intersectionObserver === null) {
      console.warn(
          '[infinitescroll] ' +
          'The intersectionObserver is not ready yet.');
      return;
    }

    getOptions(['thread', 'threadall']).then(threadOptions => {
      if (threadOptions.thread)
        this.intersectionObserver.observe(
            bar.querySelector('.load-more-button'));
      if (threadOptions.threadall)
        this.intersectionObserver.observe(
            bar.querySelector('.load-all-button'));
    });
  }

  observeLoadMoreInteropBtn(btn) {
    if (this.intersectionObserver === null) {
      console.warn(
          '[infinitescroll] ' +
          'The intersectionObserver is not ready yet.');
      return;
    }

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
      if (isEnabled) this.intersectionObserver.observe(btn);
    });
  }
};
