import { ProtobufObject } from '../../common/protojs/protojs.types';
import { InterceptorEvent } from '../domain/event';
import {
  Interceptor,
  InterceptorFilter,
  InterceptorHandlerPort,
} from './InterceptorHandler.port';

export default class InterceptorHandlerAdapter
  implements InterceptorHandlerPort
{
  constructor(private interceptors: Interceptor[]) {}

  matchInterceptors(filter: InterceptorFilter, url: string): Interceptor[] {
    return this.interceptors.filter((interceptor) => {
      return interceptor.intercepts == filter && interceptor.urlRegex.test(url);
    });
  }
  triggerEvent(eventName: string, body: ProtobufObject, id: number): void {
    const e: InterceptorEvent = new CustomEvent('TWPT_' + eventName, {
      detail: {
        body,
        id,
      },
    });
    window.dispatchEvent(e);
  }
}
