import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { getStringifiedThreadOldReplyEditor } from '../../__fixtures__/oldReplyEditor';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { SoftLockCheckboxInjectorPort } from '../../ui/injectors/softLockCheckbox.injector';
import { NodeMutationType } from '@/presentation/nodeWatcher/NodeWatcherHandler';
import ReplySoftLockAddToOldReplyEditorHandler from './addToOldReplyEditor.handler';

const isEnabledMock = vitest.fn<OptionsProviderPort['isEnabled']>();
const optionsProvider: OptionsProviderPort = {
  addListener() {
    throw new Error('Not implemented');
  },
  getOptionsConfiguration() {
    throw new Error('Not implemented');
  },
  getOptionsValues() {
    throw new Error('Not implemented');
  },
  getOptionValue() {
    throw new Error('Not implemented');
  },
  isEnabled: isEnabledMock,
};

const executeInjectorMock =
  vitest.fn<SoftLockCheckboxInjectorPort['execute']>();
const checkboxInjector: SoftLockCheckboxInjectorPort = {
  execute: executeInjectorMock,
};

const sut = new ReplySoftLockAddToOldReplyEditorHandler(
  optionsProvider,
  checkboxInjector,
);

beforeEach(() => {
  vitest.resetAllMocks();
});

describe('when the feature is disabled', () => {
  beforeEach(() => {
    document.body.innerHTML = getStringifiedThreadOldReplyEditor({
      includeSubscribeCheckbox: true,
    });

    isEnabledMock.mockReturnValue(Promise.resolve(false));
  });

  it('should not call the checkbox injector', async () => {
    await simulateMovableDialogAdded();

    expect(executeInjectorMock).not.toHaveBeenCalled();
  });
});

describe('when the feature is enabled', () => {
  beforeEach(() => {
    isEnabledMock.mockImplementation(
      async (option) => option === 'replysoftlock',
    );
  });

  it('should not call the checkbox injector if the movable dialog does not have a reply editor', async () => {
    document.body.innerHTML = `
      <ec-movable-dialog>
        <p>Stuff that is not a reply editor.</p>
        <p><button>Ok</button></p>
      </ec-movable-dialog>
    `;

    await simulateMovableDialogAdded();

    expect(executeInjectorMock).not.toHaveBeenCalled();
  });

  describe('regarding the place to inject', () => {
    describe('when the reply editor has the "Subscribe to updates" checkbox', () => {
      beforeEach(() => {
        document.body.innerHTML = getStringifiedThreadOldReplyEditor({
          includeSubscribeCheckbox: true,
        });
      });

      it(`should prepend the checkbox before that checkbox`, async () => {
        await simulateMovableDialogAdded();

        expect(executeInjectorMock).toHaveBeenCalledOnce();
        expect(executeInjectorMock).toHaveBeenCalledWith({
          element: expect.toSatisfy(
            (element: Element) => element.tagName === 'MATERIAL-CHECKBOX',
            `The injector should be called with a <material-checkbox> element as the element (the subscribe checkbox).`,
          ),
          position: 'before',
        });
      });
    });

    describe('when the reply editor doesn\'t show the "Subscribe to updates" checkbox', async () => {
      beforeEach(() => {
        document.body.innerHTML = getStringifiedThreadOldReplyEditor({
          includeSubscribeCheckbox: false,
        });
      });

      const REPLY_EDITOR_USER_ROW_CLASS = 'user';

      it(`should append the checkbox in the .${REPLY_EDITOR_USER_ROW_CLASS} element`, async () => {
        await simulateMovableDialogAdded();

        expect(executeInjectorMock).toHaveBeenCalledOnce();
        expect(executeInjectorMock).toHaveBeenCalledWith({
          element: expect.toSatisfy(
            (element: Element) =>
              element.classList.contains(REPLY_EDITOR_USER_ROW_CLASS),

            `The injector should be called with the .${REPLY_EDITOR_USER_ROW_CLASS} element as the injection element.`,
          ),
          position: 'end',
        });
      });
    });
  });
});

function simulateMovableDialogAdded() {
  return sut.onMutatedNode({
    mutationRecord: null,
    node: getMovableDialog(),
    type: NodeMutationType.NewNode,
  });
}

function getMovableDialog() {
  const movableDialog = document.querySelector('ec-movable-dialog');
  if (movableDialog === null) {
    throw new Error("Can't find in the fake test DOM the movable dialog.");
  }
  return movableDialog;
}
