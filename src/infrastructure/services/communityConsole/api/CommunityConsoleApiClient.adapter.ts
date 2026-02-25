import { fetch } from '@/common/contentScriptFetch/fetch';
import { ProtobufObject } from '@/common/protojs/protojs.types';
import { CommunityConsoleApiClientPort } from '@/services/communityConsole/api/CommunityConsoleApiClient.port';
import { ApiError } from '@/services/communityConsole/api/errors/apiError.error';
import { GenericApiError } from '@/services/communityConsole/api/errors/genericApiError.error';
import { PermissionDeniedError } from '@/services/communityConsole/api/errors/permissionDenied.error';
import {
  XClientHeader,
  XClientValue,
} from '@/services/communityConsole/api/requestIdentification/consts';

const CC_API_BASE_URL = 'https://support.google.com/s/community/api/';
const CC_API_ERRORS: Record<number, string> = {
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

export class CommunityConsoleApiClientAdapter implements CommunityConsoleApiClientPort {
  constructor(private authuser: number) {}

  async send(
    method: string,
    body: ProtobufObject,
    options?: {
      authenticated?: boolean;
    },
  ): Promise<ProtobufObject> {
    const authenticated = options?.authenticated ?? true;
    const response = await this.sendRequest(method, authenticated, body);

    if (response.status !== 200) {
      throw await this.createApiError(method, response);
    }

    return await this.parseResponse(method, response);
  }

  private async sendRequest(
    method: string,
    authenticated: boolean,
    body: ProtobufObject,
  ): Promise<Response> {
    let response: Response;
    try {
      response = await fetch(this.createURL(method, authenticated), {
        headers: {
          'content-type': 'text/plain; charset=utf-8',
          // Used to exclude our requests from being handled by FetchProxy.
          // FetchProxy will remove this header.
          [XClientHeader]: XClientValue,
        },
        body: JSON.stringify(body),
        method: 'POST',
        mode: 'cors',
        credentials: authenticated ? 'include' : 'omit',
      });
    } catch (err) {
      throw new Error(
        `An unexpected error occurred while making the request to method ${method}.`,
        { cause: err },
      );
    }
    return response;
  }

  private createURL(method: string, authenticated: boolean): string {
    const authuserPart =
      authenticated && this.authuser !== 0
        ? `?authuser=${encodeURIComponent(this.authuser)}`
        : '';

    return CC_API_BASE_URL + method + authuserPart;
  }

  private async createApiError(
    method: string,
    response: Response,
  ): Promise<ApiError> {
    let responseBody: string;

    try {
      responseBody = await response.text();
    } catch (err) {
      return new GenericApiError(method, undefined, response.status);
    }

    const numericErrorCode = this.getNumericErrorCode(
      response.status,
      responseBody,
    );
    if (numericErrorCode === 7) {
      return new PermissionDeniedError(method);
    } else {
      return new GenericApiError(
        method,
        numericErrorCode !== undefined
          ? this.getErrorCodeString(numericErrorCode)
          : undefined,
        response.status,
      );
    }
  }

  private getNumericErrorCode(
    httpStatusCode: number,
    body: string,
  ): number | undefined {
    if (httpStatusCode !== 400) {
      return undefined;
    }

    try {
      const json = JSON.parse(body);
      const errorCode = json?.[2];
      if (typeof errorCode === 'number') {
        return errorCode;
      } else {
        return undefined;
      }
    } catch (err) {
      // If something fails, we fall back to returning undefined.
      return undefined;
    }
  }

  private getErrorCodeString(errorCode: number): string {
    return CC_API_ERRORS[errorCode] ?? `Error code: ${errorCode}`;
  }

  private async parseResponse(
    method: string,
    response: Response,
  ): Promise<ProtobufObject> {
    try {
      return await response.json();
    } catch (err) {
      throw new Error(
        `An unexpected error occurred while parsing the response of method ${method}.`,
        { cause: err },
      );
    }
  }
}
