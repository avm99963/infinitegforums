import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UrlThreadDataParserServiceAdapter } from './urlThreadDataParser.service.adapter';
import { GetSelectedThreadsServiceAdapter } from './getSelectedThreads.service.adapter';
import {
  dummyThreadGroup,
  dummyThreadGroupWithMissingEcThreadSummary,
  dummyThreadGroupWithMissingTitles,
} from './__fixtures__/threadGroup';
import { UnexpectedUIError } from '../../../../ui/errors/unexpectedUI.error';

const consoleErrorSpy = vi.spyOn(console, 'error');

function checkListContainsInstanceOf(
  list: unknown[],
  expectedInstance: new (...args: any[]) => any,
) {
  const containsInstanceOfType = list.some(
    (item) => item instanceof expectedInstance,
  );
  expect(containsInstanceOfType).toBe(true);
}

describe('GetSelectedThreadsServiceAdapter', () => {
  let sut: GetSelectedThreadsServiceAdapter;

  beforeEach(() => {
    vi.resetAllMocks();
    sut = new GetSelectedThreadsServiceAdapter(
      new UrlThreadDataParserServiceAdapter(),
    );
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('when 1 thread is selected out of 2 total threads', () => {
    it('should return only 1 thread', () => {
      document.body.innerHTML = dummyThreadGroup;
      const selectedThreads = sut.execute();
      expect(selectedThreads).toHaveLength(1);
    });

    it("should return the forum id from the thread's url", () => {
      document.body.innerHTML = dummyThreadGroup;
      const selectedThreads = sut.execute();
      expect(selectedThreads[0].forumId).toBe('697265');
    });

    it("should return the thread id from the thread's url", () => {
      document.body.innerHTML = dummyThreadGroup;
      const selectedThreads = sut.execute();
      expect(selectedThreads[0].id).toBe('343836011');
    });

    it('should return the title from the element with class title-text', () => {
      document.body.innerHTML = dummyThreadGroup;
      const selectedThreads = sut.execute();
      expect(selectedThreads[0].title).toBe('Recuperación de cuenta de Google');
    });
  });

  describe('when the thread title element is not present', () => {
    it('should return an undefined title', () => {
      document.body.innerHTML = dummyThreadGroupWithMissingTitles;
      const selectedThreads = sut.execute();
      expect(selectedThreads[0].title).toBeUndefined();
    });

    it('should log an UnexpectedUIError error to the console', () => {
      document.body.innerHTML = dummyThreadGroupWithMissingTitles;

      sut.execute();

      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      checkListContainsInstanceOf(
        consoleErrorSpy.mock.calls[0],
        UnexpectedUIError,
      );
    });
  });

  describe('when the ec-thread-summary element is not present', () => {
    it('should skip returning the selected thread', () => {
      document.body.innerHTML = dummyThreadGroupWithMissingEcThreadSummary;
      const selectedThreads = sut.execute();
      expect(selectedThreads).toHaveLength(0);
    });

    it('should log an UnexpectedUIError error to the console', () => {
      document.body.innerHTML = dummyThreadGroupWithMissingEcThreadSummary;

      sut.execute();

      expect(consoleErrorSpy).toHaveBeenCalledOnce();
      checkListContainsInstanceOf(
        consoleErrorSpy.mock.calls[0],
        UnexpectedUIError,
      );
    });
  });
});
