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
} from '../../../xhrInterceptor/killSwitchHandler';
import MessageIdTracker from '../../../xhrInterceptor/MessageIdTracker';
import ResponseModifierAdapter from '../../../xhrInterceptor/ResponseModifier.adapter';
import { Modifier } from '../../../xhrInterceptor/responseModifiers/types';
import XHRProxy from '../../../xhrInterceptor/XHRProxy';

export default class XHRInterceptorScript extends Script {
  page = ScriptPage.CommunityConsole;
  environment = ScriptEnvironment.InjectedScript;
  runPhase = ScriptRunPhase.Start;

  constructor(private readonly responseModifiers: Modifier[]) {
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
