import { fetch } from '@/common/contentScriptFetch/fetch';
const CC_API_BASE_URL = 'https://support.google.com/s/community/api/';

const apiErrors = {
  0: 'OK',
  1: 'CANCELLED',
  2: 'UNKNOWN',
  3: 'INVALID_ARGUMENT',
  4: 'DEADLINE_EXCEEDED',
  5: 'NOT_FOUND',
  6: 'ALREADY_EXISTS',
  7: 'PERMISSION_DENIED',
  8: 'RESOURCE_EXHAUSTED',
  9: 'FAILED_PRECONDITION',
  10: 'ABORTED',
  11: 'OUT_OF_RANGE',
  12: 'UNIMPLEMENTED',
  13: 'INTERNAL',
  14: 'UNAVAILABLE',
  15: 'DATA_LOSS',
  16: 'UNAUTHENTICATED',
};

export const XClientHeader = 'X-Client';
export const XClientValue = 'twpt';

// Function to wrap calls to the Community Console API with intelligent error
// handling.
export function CCApi(
  method: string,
  data: unknown,
  authenticated: boolean,
  authuser: number | string = 0,
  returnUnauthorizedStatus = false,
) {
  const authuserPart =
    authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser);

  return fetch(CC_API_BASE_URL + method + authuserPart, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // Used to exclude our requests from being handled by FetchProxy.
      // FetchProxy will remove this header.
      [XClientHeader]: XClientValue,
    },
    body: JSON.stringify(data),
    method: 'POST',
    mode: 'cors',
    credentials: authenticated ? 'include' : 'omit',
  })
    .then((res) => {
      if (res.status == 200 || res.status == 400) {
        return res.json().then((data) => ({
          status: res.status,
          body: data,
        }));
      } else {
        throw new Error(
          `Status code ${res.status} was not expected when calling ${method}.`,
        );
      }
    })
    .then((res) => {
      if (res.status == 400) {
        // If the canonicalCode is PERMISSION_DENIED:
        if (returnUnauthorizedStatus && res.body?.[2] == 7)
          return {
            unauthorized: true,
          };

        const errorCode =
          apiErrors[res.body?.[2] as keyof typeof apiErrors] ??
          res.body?.[2] ??
          'unknown';
        throw new Error(
          res.body[4] ||
            `Response status 400 for method ${method}. Error code: ${errorCode}`,
        );
      }

      if (returnUnauthorizedStatus)
        return {
          unauthorized: false,
          body: res.body,
        };

      return res.body;
    });
}
