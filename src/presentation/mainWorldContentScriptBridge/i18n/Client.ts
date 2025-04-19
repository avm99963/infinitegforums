import MainWorldContentScriptBridgeClient from '../base/Client';

import { kCSTarget, kMWTarget } from './consts';
import { I18nActionMap, I18nAction, GET_UI_LANGUAGE_ACTION } from './types';

/**
 * Main World i18n client (used in scripts injected into the Main World (MW) to
 * use the chrome.i18n API).
 */
export default class MWI18nClient extends MainWorldContentScriptBridgeClient<
  I18nAction,
  I18nActionMap
> {
  protected CSTarget = kCSTarget;
  protected MWTarget = kMWTarget;

  async getUILanguage(): Promise<string> {
    return this.sendRequest(GET_UI_LANGUAGE_ACTION, undefined);
  }
}
