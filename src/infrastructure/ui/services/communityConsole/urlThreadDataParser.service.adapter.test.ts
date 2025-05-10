import { beforeEach, describe, expect, it } from 'vitest';
import { UrlThreadDataParserServiceAdapter } from './urlThreadDataParser.service.adapter';

const dummyForumId = '42';
const dummyThreadId = '99963';
const dummyMessageId = '99964';

const dummyUrlWithoutMessageId = `https://support.google.com/s/community/forum/${dummyForumId}/thread/${dummyThreadId}`;
const dummyUrlWithMessageId = `https://support.google.com/s/community/forum/${dummyForumId}/thread/${dummyThreadId}/message/${dummyMessageId}`;
const dummyUrlWithMessageIdAndAction = `https://support.google.com/s/community/forum/${dummyForumId}/thread/${dummyThreadId}/message/${dummyMessageId}#action=reply`;
const dummyUrlWithoutAnyThreadInfo = `https://support.google.com/s/community/settings`;

describe('UrlThreadDataParserServiceAdapter', () => {
  let sut: UrlThreadDataParserServiceAdapter;
  beforeEach(() => {
    sut = new UrlThreadDataParserServiceAdapter();
  });

  describe.each([
    {
      property: 'forumId' as const,
      expectedValue: dummyForumId,
      dummyUrlWithoutProperty: `https://support.google.com/s/community/thread/123`,
    },
    {
      property: 'threadId' as const,
      expectedValue: dummyThreadId,
      dummyUrlWithoutProperty: `https://support.google.com/s/community/forum/123`,
    },
  ])(
    'regarding the $property field',
    ({ property, expectedValue, dummyUrlWithoutProperty }) => {
      it('should parse it if available in a URL without message ID', () => {
        const result = sut.execute(dummyUrlWithoutMessageId);
        expect(result[property]).toBe(expectedValue);
      });

      it('should parse it if available in a URL with message ID', () => {
        const result = sut.execute(dummyUrlWithMessageId);
        expect(result[property]).toBe(expectedValue);
      });

      it('should parse it if available in a URL with message ID and action', () => {
        const result = sut.execute(dummyUrlWithMessageIdAndAction);
        expect(result[property]).toBe(expectedValue);
      });

      it('should throw an error if not available in the URL', () => {
        expect(() => sut.execute(dummyUrlWithoutProperty)).toThrowError();
      });
    },
  );

  describe('regarding the message field', () => {
    it('should not be included in the result if not available in the URL but the other data is available', () => {
      const result = sut.execute(dummyUrlWithoutMessageId);
      expect(result.messageId).toBeUndefined();
    });

    it('should be included in the result if available in the URL', () => {
      const result = sut.execute(dummyUrlWithMessageId);
      expect(result.messageId).toBe(dummyMessageId);
    });

    it('should be included in the result if available in the URL and an action is also present in the URL', () => {
      const result = sut.execute(dummyUrlWithMessageIdAndAction);
      expect(result.messageId).toBe(dummyMessageId);
    });
  });

  it('should throw an error if no data is available in the URL', () => {
    expect(() => sut.execute(dummyUrlWithoutAnyThreadInfo)).toThrowError();
  });
});
