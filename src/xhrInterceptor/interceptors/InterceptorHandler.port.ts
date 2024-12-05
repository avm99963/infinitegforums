import { ProtobufObject } from '../../common/protojs.types';

export interface InterceptorHandlerPort {
  matchInterceptors(filter: InterceptorFilter, url: string): Interceptor[];
  triggerEvent(eventName: string, body: ProtobufObject, id: number): void;
}

export interface Interceptor {
  eventName: string;
  urlRegex: RegExp;
  intercepts: InterceptorFilter;
}

export type InterceptorFilter = 'request' | 'response';
