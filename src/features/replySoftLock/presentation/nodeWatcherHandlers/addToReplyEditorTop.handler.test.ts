import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { getStringifiedThreadReplyEditor } from '../../__fixtures__/replyEditor';
import ReplySoftLockAddToReplyEditorTopHandler from './addToReplyEditorTop.handler';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { SoftLockCheckboxInjectorPort } from '../../ui/injectors/softLockCheckbox.injector';
import { NodeMutationType } from '@/presentation/nodeWatcher/NodeWatcherHandler';
import { SoftLockSettingsInjectorPort } from '../../ui/injectors/softLockSettings.injector';

const SUBSCRIBE_CHECKBOX_CONTAINER_CLASS =
  'scTailwindThreadReplyeditorsubscribe';
const REPLY_EDITOR_TOP_ROW_CLASS = 'scTailwindThreadReplyeditortop-row';

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

const executeCheckboxInjectorMock =
  vitest.fn<SoftLockCheckboxInjectorPort['execute']>();
const checkboxInjector: SoftLockCheckboxInjectorPort = {
  execute: executeCheckboxInjectorMock,
};

const executeSettingsInjectorMock =
  vitest.fn<SoftLockSettingsInjectorPort['execute']>();
const settingsInjector: SoftLockSettingsInjectorPort = {
  execute: executeSettingsInjectorMock,
};

const sut = new ReplySoftLockAddToReplyEditorTopHandler(
  optionsProvider,
  checkboxInjector,
  settingsInjector,
);

beforeEach(() => {
  vitest.resetAllMocks();
});

describe('when the feature is disabled', () => {
  beforeEach(() => {
    document.body.innerHTML = getStringifiedThreadReplyEditor({
      includeSubscribeCheckbox: true,
    });

    isEnabledMock.mockReturnValue(Promise.resolve(false));
  });

  it('should not call the checkbox injector', async () => {
    await simulateReplyEditorTopRowAdded();

    expect(executeCheckboxInjectorMock).not.toHaveBeenCalled();
  });

  it('should not call the settings injector', async () => {
    await simulateReplyEditorTopRowAdded();

    expect(executeSettingsInjectorMock).not.toHaveBeenCalled();
  });
});

describe('when the feature is enabled', () => {
  beforeEach(() => {
    isEnabledMock.mockImplementation(
      async (option) => option === 'replysoftlock',
    );
  });

  describe('regarding the place to inject', () => {
    describe('when the reply editor has the "Subscribe to updates" checkbox', () => {
      beforeEach(() => {
        document.body.innerHTML = getStringifiedThreadReplyEditor({
          includeSubscribeCheckbox: true,
        });
      });

      it(`should prepend the checkbox before the .${SUBSCRIBE_CHECKBOX_CONTAINER_CLASS} element`, async () => {
        await simulateReplyEditorTopRowAdded();

        expect(executeCheckboxInjectorMock).toHaveBeenCalledOnce();
        expect(executeCheckboxInjectorMock).toHaveBeenCalledWith({
          element: expect.toSatisfy(
            (element: Element) =>
              element.classList.contains(SUBSCRIBE_CHECKBOX_CONTAINER_CLASS),
            `The injector should be called with the .${SUBSCRIBE_CHECKBOX_CONTAINER_CLASS} element as the injection element.`,
          ),
          position: 'start',
        });
      });

      it(`should append the settings component in the .${SUBSCRIBE_CHECKBOX_CONTAINER_CLASS} element`, async () => {
        await simulateReplyEditorTopRowAdded();

        expect(executeSettingsInjectorMock).toHaveBeenCalledOnce();
        expect(executeSettingsInjectorMock).toHaveBeenCalledWith({
          element: expect.toSatisfy(
            (element: Element) =>
              element.classList.contains(SUBSCRIBE_CHECKBOX_CONTAINER_CLASS),
            `The injector should be called with the .${SUBSCRIBE_CHECKBOX_CONTAINER_CLASS} element as the injection element.`,
          ),
          position: 'end',
        });
      });
    });

    describe('when the reply editor doesn\'t show the "Subscribe to updates" checkbox', async () => {
      beforeEach(() => {
        document.body.innerHTML = getStringifiedThreadReplyEditor({
          includeSubscribeCheckbox: false,
        });
      });

      it(`should append the checkbox in the .${REPLY_EDITOR_TOP_ROW_CLASS} element`, async () => {
        await simulateReplyEditorTopRowAdded();

        expect(executeCheckboxInjectorMock).toHaveBeenCalledOnce();
        expect(executeCheckboxInjectorMock).toHaveBeenCalledWith({
          element: expect.toSatisfy(
            (element: Element) =>
              element.classList.contains(REPLY_EDITOR_TOP_ROW_CLASS),

            `The injector should be called with the .${REPLY_EDITOR_TOP_ROW_CLASS} element as the injection element.`,
          ),
          position: 'end',
        });
      });

      it(`should append the settings component in the .${REPLY_EDITOR_TOP_ROW_CLASS} element`, async () => {
        await simulateReplyEditorTopRowAdded();

        expect(executeSettingsInjectorMock).toHaveBeenCalledOnce();
        expect(executeSettingsInjectorMock).toHaveBeenCalledWith({
          element: expect.toSatisfy(
            (element: Element) =>
              element.classList.contains(REPLY_EDITOR_TOP_ROW_CLASS),
            `The injector should be called with the .${REPLY_EDITOR_TOP_ROW_CLASS} element as the injection element.`,
          ),
          position: 'end',
        });
      });
    });
  });
});

function simulateReplyEditorTopRowAdded() {
  return sut.onMutatedNode({
    mutationRecord: null,
    node: getReplyEditorTopRow(),
    type: NodeMutationType.NewNode,
  });
}

function getReplyEditorTopRow() {
  const replyEditorTopRow = document.querySelector(
    '.scTailwindThreadReplyeditortop-row',
  );
  if (replyEditorTopRow === null) {
    throw new Error(
      "Can't find in the fake test DOM the reply editor top row.",
    );
  }
  return replyEditorTopRow;
}
