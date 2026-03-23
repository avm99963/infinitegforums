import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { getStringifiedThreadReplyEditor } from '../../__fixtures__/replyEditor';
import ReplySoftLockAddToReplyEditorTopHandler from './addToReplyEditorTop.handler';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { SoftLockCheckboxInjectorPort } from '../../ui/injectors/softLockCheckbox.injector';
import { NodeMutationType } from '@/presentation/nodeWatcher/NodeWatcherHandler';

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

const sut = new ReplySoftLockAddToReplyEditorTopHandler(
  optionsProvider,
  checkboxInjector,
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

    expect(executeInjectorMock).not.toHaveBeenCalled();
  });
});

describe('when the feature is enabled', () => {
  beforeEach(() => {
    isEnabledMock.mockImplementation(
      async (option) => option === 'replysoftlock',
    );
  });

  describe('regarding the place to inject', () => {
    describe('when the reply editor has the "Subscribe to updates" button', () => {
      beforeEach(() => {
        document.body.innerHTML = getStringifiedThreadReplyEditor({
          includeSubscribeCheckbox: true,
        });
      });

      const SUBSCRIBE_CHECKBOX_CONTAINER_CLASS =
        'scTailwindThreadReplyeditorsubscribe';

      it(`should prepend the button before the .${SUBSCRIBE_CHECKBOX_CONTAINER_CLASS} element`, async () => {
        await simulateReplyEditorTopRowAdded();

        expect(executeInjectorMock).toHaveBeenCalledOnce();
        expect(executeInjectorMock).toHaveBeenCalledWith({
          container: expect.toSatisfy(
            (container: Element) =>
              container.classList.contains(SUBSCRIBE_CHECKBOX_CONTAINER_CLASS),
            `The injector should be called with the .${SUBSCRIBE_CHECKBOX_CONTAINER_CLASS} element as the injection container.`,
          ),
          position: 'start',
        });
      });
    });

    describe('when the reply editor doesn\'t show the "Subscribe to updates" button', async () => {
      beforeEach(() => {
        document.body.innerHTML = getStringifiedThreadReplyEditor({
          includeSubscribeCheckbox: false,
        });
      });

      const REPLY_EDITOR_TOP_ROW_CLASS = 'scTailwindThreadReplyeditortop-row';

      it(`should append the button in the .${REPLY_EDITOR_TOP_ROW_CLASS} element`, async () => {
        await simulateReplyEditorTopRowAdded();

        expect(executeInjectorMock).toHaveBeenCalledOnce();
        expect(executeInjectorMock).toHaveBeenCalledWith({
          container: expect.toSatisfy(
            (container: Element) =>
              container.classList.contains(REPLY_EDITOR_TOP_ROW_CLASS),

            `The injector should be called with the .${REPLY_EDITOR_TOP_ROW_CLASS} element as the injection container.`,
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
  const replyEditorTopRow = document.querySelector('.scTailwindThreadReplyeditortop-row');
  if (replyEditorTopRow === null) {
    throw new Error(
      "Can't find in the fake test DOM the reply editor top row.",
    );
  }
  return replyEditorTopRow;
}
