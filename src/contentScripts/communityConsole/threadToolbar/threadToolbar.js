import {getOptions} from '../../../common/options/optionsUtils.js';
import {softRefreshView} from '../utils/common.js';

import * as consts from './constants.js';

export default class ThreadToolbar {
  constructor() {
    this.getOptions().then(options => {
      this.updateBodyClasses(options);
    });
  }

  updateBodyClasses(options) {
    if (this.shouldSeeToolbar(options))
      document.body.classList.add('TWPT-threadtoolbar-shown');
    else
      document.body.classList.remove('TWPT-threadtoolbar-shown');

    if (options.flattenthreads && options.flattenthreads_switch_enabled)
      document.body.classList.add('TWPT-flattenthreads-enabled');
    else
      document.body.classList.remove('TWPT-flattenthreads-enabled');
  }

  shouldSeeToolbar(options) {
    return Object.values(options).some(option => !!option);
  }

  getOptions() {
    return getOptions(['flattenthreads', 'flattenthreads_switch_enabled']);
  }

  inject(node, options) {
    const toolbar = document.createElement('twpt-thread-toolbar-inject');
    toolbar.setAttribute('options', JSON.stringify(options));
    toolbar.addEventListener(consts.kEventFlattenThreadsUpdated, e => {
      const enabled = e.detail?.enabled;
      if (typeof enabled != 'boolean') return;
      chrome.storage.sync.set({flattenthreads_switch_enabled: enabled}, _ => {
        softRefreshView();
      });
    });
    node.parentElement.insertBefore(toolbar, node);
  }

  injectIfApplicable(node) {
    this.getOptions().then(options => {
      this.updateBodyClasses(options);
      if (!this.shouldSeeToolbar(options)) return;
      return this.inject(node, options);
    });
  }

  shouldInject(node) {
    return node.matches(consts.kRepliesSectionSelector);
  }
}
