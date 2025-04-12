import { beforeEach, describe, expect, it } from 'vitest';
import { CCThreadListActionInjectorAdapter } from './threadListAction.injector.adapter';

const DUMMY_KEY = 'dummy-key';

function setUpDOMWithActions(actionsInnerHTML: string) {
  document.body.innerHTML = `
    <ec-bulk-actions>
      <div class="selection"></div>
      <div class="actions">
        ${actionsInnerHTML}
      </div>
    </ec-bulk-actions>
  `;
}

function createTestElement() {
  return document.createElement('div');
}

let sut: CCThreadListActionInjectorAdapter;
beforeEach(() => {
  document.body.innerHTML = '';
  sut = new CCThreadListActionInjectorAdapter();
});

describe("if the element hasn't been injected yet", () => {
  describe('when the mark duplicate button is present', () => {
    const ACTIONS_HTML = `
      <div debugid="mark-read-button"></div>
      <div debugid="mark-duplicate-button"></div>
      <div debugid="unrelated-button"></div>
    `;

    it('should inject the element after the mark duplicate button if present', () => {
      setUpDOMWithActions(ACTIONS_HTML);

      const testElement = createTestElement();
      sut.execute({ element: testElement, key: DUMMY_KEY });

      const duplicateBtn = document.querySelector(
        '[debugid="mark-duplicate-button"]',
      );
      expect(duplicateBtn.nextElementSibling).toBe(testElement);
    });

    it('should return true', () => {
      setUpDOMWithActions(ACTIONS_HTML);

      const testElement = createTestElement();
      const result = sut.execute({ element: testElement, key: DUMMY_KEY });

      expect(result).toBe(true);
    });
  });

  it('should inject the element after the mark read button if the mark duplicate button is not present', () => {
    setUpDOMWithActions(`
      <div debugid="mark-read-button"></div>
      <div debugid="unrelated-button"></div>
    `);

    const testElement = createTestElement();
    sut.execute({ element: testElement, key: DUMMY_KEY });

    const markReadButton = document.querySelector(
      '[debugid="mark-read-button"]',
    );
    expect(markReadButton.nextElementSibling).toBe(testElement);
  });

  it('should inject the element after the mark unread button if neither the mark read and the mark duplicate button are present', () => {
    setUpDOMWithActions(`
      <div debugid="mark-unread-button"></div>
      <div debugid="unrelated-button"></div>
    `);

    const testElement = createTestElement();
    sut.execute({ element: testElement, key: DUMMY_KEY });

    const markReadButton = document.querySelector(
      '[debugid="mark-unread-button"]',
    );
    expect(markReadButton.nextElementSibling).toBe(testElement);
  });

  it('should throw an error if none of the reference buttons are present', () => {
    setUpDOMWithActions(`
      <div debugid="unrelated-button"></div>
   `);

    const testElement = createTestElement();
    expect(() =>
      sut.execute({ element: testElement, key: DUMMY_KEY }),
    ).toThrow();
  });

  it('should throw an error if the bulk actions toolbar is not present', () => {
    const testElement = createTestElement();
    expect(() =>
      sut.execute({ element: testElement, key: DUMMY_KEY }),
    ).toThrow();
  });
});

describe('if the element has been already injected', () => {
  it('should return false', () => {
    setUpDOMWithActions(`
      <div debugid="mark-read-button"></div>
      <div debugid="${DUMMY_KEY}"></div>
      <div debugid="unrelated-button"></div>
   `);

    const testElement = createTestElement();
    const result = sut.execute({ element: testElement, key: DUMMY_KEY });

    expect(result).toBe(false);
  });
});
