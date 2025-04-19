/* v8 ignore file -- @preserve This file includes utilities for tests. */

import { vi } from 'vitest';
import { ActionPayload, RequestData, ResponseData } from './types';

export const MW_TARGET = 'mw-target';
export const CS_TARGET = 'cs-target';

export const ACTION_FOO = 'foo';
export type FooRequest = string;
export type FooResponse = string;
export const dummyFooRequest = 'foo-request';
export const dummyFooResponse = 'foo-response';

export const ACTION_BAR = 'bar';
export type BarRequest = {
  options: string[];
};
export type BarResponse = Record<string, boolean>;
export const dummyBarRequest = { options: ['option1', 'option2'] };
export const dummyBarResponse = { options: { option1: true, option2: false } };

const actions = [ACTION_FOO, ACTION_BAR] as const;
export type DummyAction = (typeof actions)[number];

export interface DummyActionMap {
  [ACTION_FOO]: ActionPayload<FooRequest, FooResponse>;
  [ACTION_BAR]: ActionPayload<BarRequest, BarResponse>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (candidate: unknown) =>
  typeof candidate == 'string' && UUID_REGEX.test(candidate);

export function simulateSentMessage(
  data:
    | RequestData<DummyAction, DummyActionMap>
    | ResponseData<DummyAction, DummyActionMap>,
  source: MessageEventSource | null = window,
): void {
  window.dispatchEvent(new MessageEvent('message', { data, source }));
}

/**
 * Fixes the postMessage implementation so integration tests work for our use
 * case.
 *
 * NOTE: this is not a complete implementation of postMessage.
 */
export function fixPostMessage() {
  const postMessageMock = vi.spyOn(window, 'postMessage');
  postMessageMock.mockImplementation((message: any) =>
    simulateSentMessage(message),
  );
}
