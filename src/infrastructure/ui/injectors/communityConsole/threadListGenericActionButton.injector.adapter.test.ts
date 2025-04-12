import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CCThreadListGenericActionButtonInjectorAdapter } from './threadListGenericActionButton.injector.adapter';
import { CCThreadListActionInjectorAdapter } from './threadListAction.injector.adapter';

const DUMMY_ICON = 'dummy-icon';
const DUMMY_KEY = 'dummy-key';
const DUMMY_TOOLTIP = 'dummy-tooltip';

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

const chromeI18nGetMessageMock: typeof chrome.i18n.getMessage = vi.fn();
global.chrome = {
  i18n: {
    getMessage: chromeI18nGetMessageMock,
  } as typeof chrome.i18n,
} as typeof chrome;

const injector = new CCThreadListActionInjectorAdapter();
const injectorExecuteSpy = vi.spyOn(injector, 'execute');

let sut: CCThreadListGenericActionButtonInjectorAdapter;
beforeEach(() => {
  vi.resetAllMocks();
  document.body.innerHTML = '';
  sut = new CCThreadListGenericActionButtonInjectorAdapter(injector);
});

describe('when a reference button exists', () => {
  // This is a copy of the vanilla HTML rendered by the Community Console.
  const ACTIONS_HTML = `
    <material-button
      animated="true"
      debugid="mark-duplicate-button"
      icon=""
      class="_ngcontent-lit-37 _nghost-lit-2"
      aria-label="Mark as duplicate"
      tabindex="0"
      role="button"
      aria-disabled="false"
      elevation="1"
    >
      <div class="content _ngcontent-lit-2">
        <material-icon
          icon="content_copy"
          class="_ngcontent-lit-37
            _nghost-lit-3"
        >
          <i
            class="material-icon-i material-icons-extended _ngcontent-lit-3"
            role="img"
            aria-hidden="true"
          >
            content_copy
          </i>
        </material-icon>
      </div>
      <material-ripple aria-hidden="true" class="_ngcontent-lit-2">
      </material-ripple>
      <div class="touch-target _ngcontent-lit-2"></div>
      <div class="focus-ring _ngcontent-lit-2"></div>
    </material-button>
  `;

  beforeEach(() => {
    setUpDOMWithActions(ACTIONS_HTML);
  });

  it('should call the thread list action injector', () => {
    sut.execute({ icon: DUMMY_ICON, key: DUMMY_KEY });

    expect(injectorExecuteSpy).toHaveBeenCalledOnce();
  });

  it('should call the thread list action injector with the supplied key', () => {
    sut.execute({ icon: DUMMY_ICON, key: DUMMY_KEY });

    expect(injectorExecuteSpy).toHaveBeenCalledWith(
      expect.objectContaining({ key: DUMMY_KEY }),
    );
  });

  describe('regarding the element passed to the thread list action injector', () => {
    function getInjectedElement() {
      return injectorExecuteSpy.mock.lastCall?.[0].element;
    }

    describe('when not passed a tooltip', () => {
      let injectedElement: Element;
      beforeEach(() => {
        sut.execute({ icon: DUMMY_ICON, key: DUMMY_KEY });

        injectedElement = getInjectedElement();
      });

      it('should be a clone of the reference button', () => {
        expect(injectedElement).toBeDefined();
        expect(injectedElement.tagName).toBe('MATERIAL-BUTTON');
        expect(injectedElement.className).toContain('_ngcontent-lit-37 ');
        expect(injectedElement.className).toContain('_nghost-lit-2');
      });

      it('should include the supplied icon', () => {
        const injectedElementIcon =
          injectedElement.querySelector('material-icon');
        expect(injectedElementIcon.textContent.trim()).toBe(DUMMY_ICON);
      });

      it('should have the key in the debugid attribute', () => {
        expect(injectedElement.getAttribute('debugid')).toBe(DUMMY_KEY);
      });
    });

    it('should inject a tooltip when passed', () => {
      sut.execute({ icon: DUMMY_ICON, key: DUMMY_KEY, tooltip: DUMMY_TOOLTIP });

      expect(document.body.innerHTML).toContain(DUMMY_TOOLTIP);
    });
  });
});

it('should throw an error when a reference button is not found', () => {
  setUpDOMWithActions('');

  expect(() => sut.execute({ icon: DUMMY_ICON, key: DUMMY_KEY })).toThrow();
});
