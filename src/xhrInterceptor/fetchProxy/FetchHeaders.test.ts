/**
 * @jest-environment ./src/xhrInterceptor/fetchProxy/__environments__/fetchEnvironment.ts
 */

import { describe, expect, it } from '@jest/globals';
import FetchHeaders from './FetchHeaders';

describe('FetchHeaders', () => {
  const dummyHeaderName = 'X-Foo';
  const dummyHeaderValue = 'bar';
  const dummyHeadersPerFormat: { description: string; value: HeadersInit }[] = [
    {
      description: 'a Headers instance',
      value: new Headers({ [dummyHeaderName]: dummyHeaderValue }),
    },
    {
      description: 'an object',
      value: { [dummyHeaderName]: dummyHeaderValue },
    },
    {
      description: 'an array',
      value: [[dummyHeaderName, dummyHeaderValue]],
    },
  ];

  describe.each(dummyHeadersPerFormat)(
    'when the headers are presented as $description',
    ({ value }) => {
      describe('hasValue', () => {
        it('should return true when the header with the provided value is present', () => {
          const sut = new FetchHeaders(value);
          const result = sut.hasValue(dummyHeaderName, dummyHeaderValue);

          expect(result).toBe(true);
        });

        it("should return true when a header with the provided value is present even if the provided name doesn't have the same case", () => {
          const sut = new FetchHeaders(value);
          const result = sut.hasValue('x-FoO', dummyHeaderValue);

          expect(result).toBe(true);
        });

        it('should return false when a header with the provided value is not present', () => {
          const sut = new FetchHeaders(value);
          const result = sut.hasValue('X-NonExistent', dummyHeaderValue);

          expect(result).toBe(false);
        });
      });

      describe('removeHeader', () => {
        it('should remove the header if it is present', () => {
          const sut = new FetchHeaders(value);
          sut.removeHeader(dummyHeaderName);

          if (value instanceof Headers) {
            expect(value.has(dummyHeaderName)).toBe(false);
          } else if (Array.isArray(value)) {
            expect(value).not.toContain(
              expect.arrayContaining([dummyHeaderName]),
            );
          } else {
            expect(value).not.toHaveProperty(dummyHeaderName);
          }
        });
      });
    },
  );

  describe('when the headers are presented as undefined', () => {
    describe('hasValue', () => {
      it('should return false', () => {
        const sut = new FetchHeaders(undefined);
        const result = sut.hasValue(dummyHeaderName, dummyHeaderValue);

        expect(result).toBe(false);
      });
    });

    describe('removeHeader', () => {
      it('should not throw', () => {
        const sut = new FetchHeaders(undefined);
        expect(() => sut.removeHeader(dummyHeaderName)).not.toThrow();
      });
    });
  });
});
