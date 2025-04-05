import { describe, expect, it } from 'vitest';
import FetchInput from './FetchInput';

describe('FetchInput', () => {
  describe('getUrl', () => {
    const urlString = 'https://example.avm99963.com/';

    it('should return input when input is already a string', () => {
      const dummyInput = urlString;

      const sut = new FetchInput(dummyInput);
      const result = sut.getUrl();

      expect(result).toBe(urlString);
    });

    it('should return stringified url when input is a URL instance', () => {
      const dummyInput = new URL(urlString);

      const sut = new FetchInput(dummyInput);
      const result = sut.getUrl();

      expect(result).toBe(urlString);
    });

    it('should return url string when input is a Request instance', () => {
      const dummyInput = new Request(urlString);

      const sut = new FetchInput(dummyInput);
      const result = sut.getUrl();

      expect(result).toBe(urlString);
    });
  });
});
