import {configureLocalization, msg, updateWhenLocaleChanges} from '@lit/localize';
import {LitElement} from 'lit';

import MWI18nClient from './mainWorldI18n/Client';
import {allLocales, sourceLocale, targetLocales} from '../lit-locales/generated/locales.js';

export class I18nLitElement extends LitElement {
  #MWI18nClient;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.#MWI18nClient = new MWI18nClient();
    this.#setUpLitL10n();
  }

  #setUpLitL10n() {
    let pLocale;
    if (typeof chrome !== 'undefined' && chrome.i18n) {
      pLocale = Promise.resolve(chrome.i18n.getUILanguage());
    } else {
      pLocale = this.#MWI18nClient.getUILanguage();
    }
    pLocale.then(browserLocale => {
      let locale = browserLocale.substr(0, 2).toLowerCase();
      if (locale == 'pt') locale = 'pt_BR';
      const sanitizedLocale = allLocales.includes(locale) ? locale : 'en';
      setLocale(sanitizedLocale);
    });
  }
}

export const {getLocale, setLocale} = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: locale => {
    if (!allLocales.includes(locale)) locale = 'en';
    return import(
        /* webpackMode: "eager" */
        /* webpackExclude: /locales\.json$/ */
        `../lit-locales/generated/${locale}.js`);
  },
});

/** Localized string for the extension name. */
export const EXTENSION_NAME = () => msg('TW Power Tools', {
  desc: 'The extension name.',
});

/** Localized string for the common "skip to main content" buttons. */
export const SKIP_TO_MAIN_CONTENT = () => msg('Skip to main content', {
  desc:
      'Text for the button that lets users skip directly to the main content in a page.'
});
