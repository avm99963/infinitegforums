export default class FetchHeaders {
  constructor(private headers: HeadersInit | undefined) {}

  hasValue(name: string, value: string) {
    if (!this.headers) {
      return false;
    } else if (this.headers instanceof Headers) {
      return this.headers.get(name) == value;
    } else {
      const headersArray = Array.isArray(this.headers)
        ? this.headers
        : Object.entries(this.headers);
      return headersArray.some(
        ([candidateHeaderName, candidateValue]) =>
          this.isEqualCaseInsensitive(candidateHeaderName, name) &&
          candidateValue === value,
      );
    }
  }

  removeHeader(name: string) {
    if (!this.headers) {
      return;
    } else if (this.headers instanceof Headers) {
      this.headers.delete(name);
    } else if (Array.isArray(this.headers)) {
      const index = this.headers.findIndex(([candidateHeaderName]) =>
        this.isEqualCaseInsensitive(candidateHeaderName, name),
      );
      if (index !== -1) delete this.headers[index];
    } else {
      const headerNames = Object.keys(this.headers);
      const headerName = headerNames.find((candidateName) =>
        this.isEqualCaseInsensitive(candidateName, name),
      );
      if (headerName) delete this.headers[headerName];
    }
  }

  private isEqualCaseInsensitive(a: string, b: string) {
    return (
      a.localeCompare(b, undefined, {
        sensitivity: 'accent',
      }) == 0
    );
  }
}
