import { ApiError } from './apiError.error';

export class GenericApiError extends ApiError {
  constructor(
    method: string,
    errorCode: string | undefined,
    httpStatusCode: number,
  ) {
    const message =
      errorCode !== undefined
        ? `${errorCode} (HTTP status ${httpStatusCode})`
        : `HTTP status ${httpStatusCode}`;
    super(method, message);
  }
}
