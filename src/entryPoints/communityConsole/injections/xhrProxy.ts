import FetchProxy from '../../../xhrInterceptor/fetchProxy/FetchProxy';
import InterceptorHandlerAdapter from '../../../xhrInterceptor/interceptors/InterceptorHandler.adapter';
import interceptors from '../../../xhrInterceptor/interceptors/interceptors';
import {KILL_SWITCH_LOCALSTORAGE_KEY, KILL_SWITCH_LOCALSTORAGE_VALUE} from '../../../xhrInterceptor/killSwitchHandler.js';
import MessageIdTracker from '../../../xhrInterceptor/MessageIdTracker';
import ResponseModifierAdapter from '../../../xhrInterceptor/ResponseModifier.adapter';
import createMessageRemoveParentRef from '../../../xhrInterceptor/responseModifiers/createMessageRemoveParentRef';
import flattenThread from '../../../xhrInterceptor/responseModifiers/flattenThread';
import loadMoreThread from '../../../xhrInterceptor/responseModifiers/loadMoreThread';
import { Modifier } from '../../../xhrInterceptor/responseModifiers/types';
import XHRProxy from '../../../xhrInterceptor/XHRProxy';

export const responseModifiers: Modifier[] = [
  loadMoreThread,
  flattenThread,
  createMessageRemoveParentRef,
];

if (window.localStorage.getItem(KILL_SWITCH_LOCALSTORAGE_KEY) !==
    KILL_SWITCH_LOCALSTORAGE_VALUE) {
  const responseModifier = new ResponseModifierAdapter(responseModifiers);
  const interceptorHandler = new InterceptorHandlerAdapter(interceptors.interceptors);
  const messageIdTracker = new MessageIdTracker();

  new XHRProxy(responseModifier, messageIdTracker);

  const fetchProxy = new FetchProxy(responseModifier, interceptorHandler, messageIdTracker);
  fetchProxy.enableInterception();
}
