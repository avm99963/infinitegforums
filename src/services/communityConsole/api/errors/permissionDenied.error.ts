import { ApiError } from './apiError.error';

export class PermissionDeniedError extends ApiError {
  constructor(method: string) {
    const message = 'Permission denied.';
    super(method, message);
  }
}
