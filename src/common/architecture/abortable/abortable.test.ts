import { beforeEach, expect, it, vi } from 'vitest';
import { makeAbortable, PromiseAbortError } from './abortable';

const stubFunction = vi.fn<(a: string, b: number) => Promise<string>>();
const dummyArguments: [string, number] = ['a', 2];
const dummyReturnConstant = 'symphony';
const dummyError = new Error('Dummy error.');

const abortableFunction = makeAbortable(stubFunction);

beforeEach(() => {
  vi.resetAllMocks();
});

it('should call original function with the same arguments', async () => {
  stubFunction.mockResolvedValue(dummyReturnConstant);
  const abortController = new AbortController();

  await abortableFunction(
    { signal: abortController.signal },
    ...dummyArguments,
  );

  expect(stubFunction).toBeCalledWith(...dummyArguments);
});

it('should resolve to the value resolved by the original function', async () => {
  stubFunction.mockResolvedValue(dummyReturnConstant);
  const abortController = new AbortController();

  await abortableFunction(
    { signal: abortController.signal },
    ...dummyArguments,
  );

  expect(stubFunction).toHaveResolvedWith(dummyReturnConstant);
});

it('should reject with the same reason as rejected by the original function', async () => {
  stubFunction.mockRejectedValue(dummyError);
  const abortController = new AbortController();

  await expect(
    abortableFunction({ signal: abortController.signal }, ...dummyArguments),
  ).rejects.toThrow(dummyError);
});

it('should throw with a PromiseAbortError if the signal is already aborted', async () => {
  stubFunction.mockRejectedValue(dummyError);

  await expect(
    abortableFunction({ signal: AbortSignal.abort() }, ...dummyArguments),
  ).rejects.toThrow(PromiseAbortError);
});

it('should throw with a PromiseAbortError if the signal is aborted after calling the function but before resolving the promise', async () => {
  // The promise will never resolve nor reject. We expect the signal abort to
  // immediately reject the wrapped abortable function.
  stubFunction.mockImplementation(() => new Promise(() => {}));
  const abortController = new AbortController();

  const promise = abortableFunction(
    { signal: abortController.signal },
    ...dummyArguments,
  );
  abortController.abort();

  await expect(promise).rejects.toThrow(PromiseAbortError);
});
