export class ApiError extends Error {
  constructor(method: string, message: string) {
    super(`Call to ${method} returned an error: ${message}`);
  }
}
