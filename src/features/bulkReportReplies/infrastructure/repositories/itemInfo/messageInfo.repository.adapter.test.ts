import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MessageInfoRepositoryAdapter } from './messageInfo.repository.adapter';

describe('MessageInfoRepositoryAdapter', () => {
  const dummyForumId = '42';
  const dummyThreadId = '99963';
  const dummyMessageId = '99964';

  let sut: MessageInfoRepositoryAdapter;

  beforeEach(() => {
    vi.resetAllMocks();

    sut = new MessageInfoRepositoryAdapter();
  });

  function stubLocationHref(url: string) {
    vi.stubGlobal('location', { href: url });
  }

  describe.each([
    {
      testSuite: 'regarding obtaining the thread ID',
      property: 'threadId' as const,
      dummyValue: dummyThreadId,
      urlWithoutProperty: `https://support.google.com/s/community/forum/${dummyForumId}`,
    },
    {
      testSuite: 'regarding obtaining the forum ID',
      property: 'forumId' as const,
      dummyValue: dummyForumId,
      urlWithoutProperty: `https://support.google.com/s/community/thread/${dummyThreadId}`,
    },
  ])('$testSuite', ({ property, dummyValue, urlWithoutProperty }) => {
    let elementInsideMessage: Element;
    beforeEach(() => {
      document.body.innerHTML = `<div class="scTailwindThreadMessageMessagecardcontent" data-focus-item="true" data-focus-group="0" tabindex="-1" data-focus-id="${dummyMessageId}" data-stats-visible-imp="true" data-stats-ve="64" data-stats-id="${dummyMessageId}">
        <div id="element-inside-message"></div>
      </div>`;
      elementInsideMessage = document.getElementById('element-inside-message');
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it.each([
      {
        url: `https://support.google.com/s/community/forum/${dummyForumId}/thread/${dummyThreadId}`,
        testNameSuffix: '',
      },
      {
        url: `https://support.google.com/s/community/forum/${dummyForumId}/search/query%3Dforum%253A${dummyForumId}%2Blang%253Aca/thread/${dummyThreadId}`,
        testNameSuffix: 'when it includes a search query',
      },
      {
        url: `https://support.google.com/s/community/forum/${dummyForumId}/thread/${dummyThreadId}#action=reply`,
        testNameSuffix: 'when it includes a fragment',
      },
    ])('should obtain it from the URL $testNameSuffix', ({ url }) => {
      stubLocationHref(url);
      const result = sut.getInfo(elementInsideMessage);
      expect(result[property]).toBe(dummyValue);
    });

    it('should throw an error when it is not found in the URL', () => {
      stubLocationHref(urlWithoutProperty);
      expect(() => sut.getInfo(elementInsideMessage)).toThrow();
    });
  });

  describe('regarding obtaining the message ID', () => {
    beforeEach(() => {
      stubLocationHref(
        `https://support.google.com/s/community/forum/${dummyForumId}/thread/${dummyThreadId}`,
      );
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    describe('when treating a top-level reply', () => {
      it('should obtain it from the data-statsid attribute of the closest .scTailwindThreadMessageMessagecardcontent element', () => {
        document.body.innerHTML = `<div class="scTailwindThreadMessageMessagecardcontent" data-focus-item="true" data-focus-group="0" tabindex="-1" data-focus-id="${dummyMessageId}" data-stats-visible-imp="true" data-stats-ve="64" data-stats-id="${dummyMessageId}">
          <div id="element-inside-message"></div>
        </div>`;
        const elementInsideMessage = document.getElementById(
          'element-inside-message',
        );

        const result = sut.getInfo(elementInsideMessage);

        expect(result.messageId).toBe(dummyMessageId);
      });
    });

    describe('when treating a nested reply', () => {
      it('should obtain it from the data-statsid attribute of the closest .scTailwindThreadMessageCommentcardnested-reply element', () => {
        document.body.innerHTML = `<div class="scTailwindThreadMessageCommentcardnested-reply" data-focus-item="true" data-focus-group="9" tabindex="0" data-focus-id="${dummyMessageId}" data-stats-visible-imp="true" data-stats-ve="64" data-stats-id="${dummyMessageId}">
          <div id="element-inside-message"></div>
        </div>`;
        const elementInsideMessage = document.getElementById(
          'element-inside-message',
        );

        const result = sut.getInfo(elementInsideMessage);

        expect(result.messageId).toBe(dummyMessageId);
      });
    });

    it("should throw an error if the data-statsid attribute doesn't exist", () => {
      document.body.innerHTML = `<div class="scTailwindThreadMessageMessagecardcontent" data-focus-item="true" data-focus-group="0" tabindex="-1" data-focus-id="${dummyMessageId}" data-stats-visible-imp="true" data-stats-ve="64">
        <div id="element-inside-message"></div>
      </div>`;
      const elementInsideMessage = document.getElementById(
        'element-inside-message',
      );

      expect(() => sut.getInfo(elementInsideMessage)).toThrow();
    });

    it("should throw an error if the .scTailwindThreadMessageMessagecardcontent element doesn't exist", () => {
      document.body.innerHTML = `<div class="something-else">
        <div id="element-inside-message"></div>
      </div>`;
      const elementInsideMessage = document.getElementById(
        'element-inside-message',
      );

      expect(() => sut.getInfo(elementInsideMessage)).toThrow();
    });
  });
});
