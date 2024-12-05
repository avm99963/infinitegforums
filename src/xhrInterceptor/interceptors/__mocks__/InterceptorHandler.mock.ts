import { jest } from '@jest/globals';
import { InterceptorHandlerPort } from '../InterceptorHandler.port';

export const matchInterceptorsMock =
  jest.fn<InterceptorHandlerPort['matchInterceptors']>();
export const triggerEventMock =
  jest.fn<InterceptorHandlerPort['triggerEvent']>();

class InterceptorHandlerMock {
  matchInterceptors(
    ...args: Parameters<InterceptorHandlerPort['matchInterceptors']>
  ): ReturnType<InterceptorHandlerPort['matchInterceptors']> {
    return matchInterceptorsMock(...args);
  }

  triggerEvent(
    ...args: Parameters<InterceptorHandlerPort['triggerEvent']>
  ): ReturnType<InterceptorHandlerPort['triggerEvent']> {
    return triggerEventMock(...args);
  }
}

export { InterceptorHandlerMock };
