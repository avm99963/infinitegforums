export class PromiseAbortError extends Error {
  constructor(message = 'The promise was aborted.') {
    super(message);
  }
}

/**
 * Function that takes any promise-returning function and makes it abortable.
 *
 * @param f The function to make abortable
 * @returns A new function that takes an AbortSignal and the rest of the
 * original arguments.
 */
export function makeAbortable<T extends (...args: unknown[]) => Promise<unknown>>(
  f: T,
) {
  return function (
    options: { signal: AbortSignal },
    ...args: Parameters<T>
  ): ReturnType<T> {
    const { signal } = options;

    return new Promise((resolve, reject) => {
      if (signal.aborted) {
        return reject(new PromiseAbortError());
      }

      const onAbort = () => {
        reject(
          new PromiseAbortError(
            `Operation '${f.name ?? 'anonymous'}' was aborted.`,
          ),
        );
      };
      signal.addEventListener('abort', onAbort, { once: true });

      f(...args)
        .then((val) => resolve(val))
        .catch((reason) => {
          // If reject was already called by an abort, this call will be silently ignored.
          reject(reason);
        })
        .finally(() => {
          signal.removeEventListener('abort', onAbort);
        });
    }) as ReturnType<T>;
  };
}
