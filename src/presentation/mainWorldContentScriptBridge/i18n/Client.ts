import { ChromeI18nPort } from '@/services/i18n/chrome/ChromeI18n.port';
import MainWorldContentScriptBridgeClient from '../base/Client';

import { kCSTarget, kMWTarget } from './consts';
import { I18nActionMap, I18nAction, GET_UI_LANGUAGE_ACTION, GetMessageRequest, GetMessageResponse, GET_MESSAGE_ACTION } from './types';

/**
 * Main World i18n client (used in scripts injected into the Main World (MW) to
 * use the chrome.i18n API).
 */
export default class MWI18nClient extends MainWorldContentScriptBridgeClient<
  I18nAction,
  I18nActionMap
> implements ChromeI18nPort {
  protected CSTarget = kCSTarget;
  protected MWTarget = kMWTarget;

  getUILanguage(): Promise<string> {
    return this.sendRequest(GET_UI_LANGUAGE_ACTION, undefined);
  }

  getMessage(request: GetMessageRequest): Promise<GetMessageResponse> {
    return this.sendRequest(GET_MESSAGE_ACTION, request);
  }
}
