import MainWorldContentScriptBridgeServer, {
  Handlers,
} from '../base/Server';

import { kCSTarget, kMWTarget } from './consts';
import { I18nActionMap, I18nAction, GET_UI_LANGUAGE_ACTION } from './types';

/**
 * Main World i18n server (used in content scripts to be able to serve the
 * chrome.i18n API to Main World (MW) scripts).
 */
export default class MWI18nServer extends MainWorldContentScriptBridgeServer<
  I18nAction,
  I18nActionMap
> {
  protected CSTarget = kCSTarget;
  protected MWTarget = kMWTarget;

  protected handlers: Handlers<I18nAction, I18nActionMap> = {
    [GET_UI_LANGUAGE_ACTION]: () => chrome.i18n.getUILanguage(),
  };
}
