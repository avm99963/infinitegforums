import { OptionsConfiguration } from '../../../common/options/OptionsConfiguration.js';
import {
  OptionCodename,
  OptionsValues,
} from '../../../common/options/optionsPrototype.js';
import { softRefreshView } from '../../../contentScripts/communityConsole/utils/common.js';
import { OptionsModifierPort } from '../../../services/options/OptionsModifier.port.js';
import { OptionsProviderPort } from '../../../services/options/OptionsProvider.js';

import * as consts from './constants';

declare global {
  interface WindowEventMap {
    [consts.kEventOptionUpdatedFromToolbar]: CustomEvent<{
      option: OptionCodename;
      enabled: boolean;
      softRefreshView?: boolean;
    }>;
  }
}

export default class ThreadToolbar {
  private isSetUp = false;
  private toolbar: HTMLElement;
  private toolbarOptions: OptionsValues;

  constructor(
    private optionsProvider: OptionsProviderPort,
    private optionsModifier: OptionsModifierPort,
  ) {}

  async injectIfApplicable(element: HTMLElement) {
    const options = await this.optionsProvider.getOptionsValues();
    this.updateBodyClasses(options);
    if (!this.shouldSeeToolbar(options)) return;
    return this.inject(element, options);
  }

  private updateBodyClasses(options: OptionsValues) {
    if (this.shouldSeeToolbar(options)) {
      document.body.classList.add('TWPT-threadtoolbar-shown');
    } else {
      document.body.classList.remove('TWPT-threadtoolbar-shown');
    }

    if (options.flattenthreads && options.flattenthreads_switch_enabled) {
      document.body.classList.add('TWPT-flattenthreads-enabled');
    } else {
      document.body.classList.remove('TWPT-flattenthreads-enabled');
    }
  }

  // If none of the following options are enabled when the thread is shown,
  // activating their switches wouldn't have any effect, so we won't inject the
  // toolbar.
  private shouldSeeToolbar(options: OptionsValues) {
    return [options.flattenthreads, options.bulkreportreplies].some(
      (option) => option,
    );
  }

  private inject(element: HTMLElement, options: OptionsValues) {
    this.setUp();

    const toolbar = document.createElement('twpt-thread-toolbar-inject');
    this.toolbar = toolbar;

    this.updateToolbarOptions(options);

    toolbar.addEventListener(
      consts.kEventOptionUpdatedFromToolbar,
      async (
        e: WindowEventMap[typeof consts.kEventOptionUpdatedFromToolbar],
      ) => {
        const option = e.detail.option;
        const enabled = e.detail.enabled;
        await this.optionsModifier.set(option, enabled);

        const newOptions = {
          ...this.toolbarOptions,
          [option]: enabled,
        };
        this.updateToolbarOptions(newOptions);

        if (e.detail?.softRefreshView) {
          softRefreshView();
        }
      },
    );
    element.parentElement.insertBefore(toolbar, element);
  }

  private setUp() {
    if (this.isSetUp) return;

    this.optionsProvider.addListener((_, currentConf) => {
      this.updateToolbarDueToExternalOptionsUpdate(currentConf);
    });

    this.isSetUp = true;
  }

  private updateToolbarDueToExternalOptionsUpdate(conf: OptionsConfiguration) {
    if (!this.toolbar) return;

    // We want to freeze all shown options except for the bulk report replies one,
    // since it's the only that applies dynamically. All the other ones apply as
    // configured when the thread loaded.
    const newOptions = {
      ...JSON.parse(this.toolbar.getAttribute('options')),
      bulkreportreplies_switch_enabled: conf.getOptionValue(
        'bulkreportreplies_switch_enabled',
      ),
    };
    this.updateToolbarOptions(newOptions);
  }

  private updateToolbarOptions(options: OptionsValues) {
    this.toolbarOptions = options;
    this.toolbar.setAttribute('options', JSON.stringify(this.toolbarOptions));
  }
}
