import { configureLocalization, updateWhenLocaleChanges } from '@lit/localize';
import { LitElement } from 'lit';

import MWI18nClient from '../../presentation/mainWorldContentScriptBridge/i18n/Client';
import {
  allLocales,
  sourceLocale,
  targetLocales,
} from '../../lit-locales/generated/locales.js';

export class I18nLitElement extends LitElement {
  // TODO(https://iavm.xyz/b/twpowertools/226): use an abstraction. Don't depend
  // directly on the MWI18nClient and choose between it and the chrome API on
  // runtime (this is the control freak anti-pattern).
  private MWI18nClient: MWI18nClient;

  constructor() {
    super();
    updateWhenLocaleChanges(this);
    this.MWI18nClient = new MWI18nClient();
    this.setUpLitL10n();
  }

  private setUpLitL10n() {
    let pLocale: Promise<string>;
    if (typeof chrome !== 'undefined' && chrome.i18n) {
      pLocale = Promise.resolve(chrome.i18n.getUILanguage());
    } else {
      pLocale = this.MWI18nClient.getUILanguage();
    }
    pLocale.then((browserLocale) => {
      let locale = browserLocale.substr(0, 2).toLowerCase();
      if (locale == 'pt') locale = 'pt_BR';
      const sanitizedLocale = allLocales.includes(locale) ? locale : 'en';
      setLocale(sanitizedLocale);
    });
  }
}

export const { getLocale, setLocale } = configureLocalization({
  sourceLocale,
  targetLocales,
  loadLocale: (locale) => {
    if (!allLocales.includes(locale)) locale = 'en';
    return import(
      /* webpackMode: "eager" */
      /* webpackExclude: /locales\.json$/ */
      `../../lit-locales/generated/${locale}.js`
    );
  },
});
