import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import Script, {
  ScriptEnvironment,
  ScriptPage,
  ScriptRunPhase,
} from '../../../common/architecture/scripts/Script';
import FetchProxy from '../../../xhrInterceptor/fetchProxy/FetchProxy';
import InterceptorHandlerAdapter from '../../../xhrInterceptor/interceptors/InterceptorHandler.adapter';
import interceptors from '../../../xhrInterceptor/interceptors/interceptors';
import {
  KILL_SWITCH_LOCALSTORAGE_KEY,
  KILL_SWITCH_LOCALSTORAGE_VALUE,
} from '../../../xhrInterceptor/killSwitchHandler/killSwitchHandler';
import MessageIdTracker from '../../../xhrInterceptor/messageIdTracker/MessageIdTracker';
import ResponseModifierAdapter from '../../../xhrInterceptor/responseModifier/ResponseModifier.adapter';
import { ResponseModifier } from '../../../xhrInterceptor/responseModifier/types';
import XHRProxy from '../../../xhrInterceptor/xhrProxy/XHRProxy';

export default class XHRInterceptorScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.InjectedScript;
  runPhase = ScriptRunPhase.Start;

  constructor(
    private readonly responseModifiers: ResponseModifier[],
    private readonly optionsProvider: OptionsProviderPort,
  ) {
    super();
  }

  // TODO: Refactor this to the DI architecture. It will need changes to the
  // classes being initialized here.
  execute() {
    if (
      window.localStorage.getItem(KILL_SWITCH_LOCALSTORAGE_KEY) !==
      KILL_SWITCH_LOCALSTORAGE_VALUE
    ) {
      const responseModifier = new ResponseModifierAdapter(
        this.responseModifiers,
        this.optionsProvider,
      );
      const interceptorHandler = new InterceptorHandlerAdapter(
        interceptors.interceptors,
      );
      const messageIdTracker = new MessageIdTracker();

      new XHRProxy(responseModifier, messageIdTracker);

      const fetchProxy = new FetchProxy(
        responseModifier,
        interceptorHandler,
        messageIdTracker,
      );
      fetchProxy.enableInterception();
    }
  }
}
