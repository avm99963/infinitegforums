import { MDCTooltip } from '@material/tooltip';
import { createExtBadge } from '../../../../contentScripts/communityConsole/utils/common';
import { ThreadListActionInjectorPort } from '../../../../ui/injectors/threadListAction.injector.port';
import {
  ThreadListGenericActionButtonInjectorPort,
  ThreadListGenericActionButtonOptions,
} from '../../../../ui/injectors/threadListGenericActionButton.injector.port';
import { createPlainTooltip } from '../../../../common/tooltip';

export const GENERIC_ACTION_BUTTON_TEST_ID = 'twpt-generic-action-button';

export class CCThreadListGenericActionButtonInjectorAdapter
  implements ThreadListGenericActionButtonInjectorPort
{
  constructor(private threadListActionInjector: ThreadListActionInjectorPort) {}

  execute(options: ThreadListGenericActionButtonOptions): Element {
    const button = this.createGenericButton();
    button.setAttribute('debugid', options.key);
    button.setAttribute('data-testid', GENERIC_ACTION_BUTTON_TEST_ID);
    button.classList.add('TWPT-btn--with-badge');
    button.querySelector('material-icon').setAttribute('icon', options.icon);
    button.querySelector('i.material-icon-i').textContent = options.icon;

    // TODO(https://iavm.xyz/b/twpowertools/230): fix these types.
    const [badge, badgeTooltip] = createExtBadge() as [HTMLDivElement, any];
    button.append(badge);

    const wasInjected = this.threadListActionInjector.execute({
      element: button,
      key: options.key,
    });
    if (!wasInjected) {
      return null;
    }

    if (options.tooltip !== undefined) {
      createPlainTooltip(button, options.tooltip);
    }
    new MDCTooltip(badgeTooltip);

    return button;
  }

  private createGenericButton() {
    const referenceBtn = this.getReferenceBtn();
    const clone = referenceBtn.cloneNode(true);
    if (!(clone instanceof HTMLElement)) {
      throw new Error('The cloned reference button is not an HTMLElement.');
    }
    return clone;
  }

  private getReferenceBtn() {
    const actionsContainer = document.querySelector('ec-bulk-actions .actions');
    if (actionsContainer === null) {
      throw new Error('Could not find thread list actions container.');
    }

    const referenceBtn =
      actionsContainer.querySelector(
        '[debugid="mark-read-button"], [debugid="mark-unread-button"]',
      ) ?? actionsContainer.querySelector('[debugid="mark-duplicate-button"]');
    if (referenceBtn === null) {
      throw new Error(
        'Could not find a reference button in the bulk actions toolbar.',
      );
    }
    return referenceBtn;
  }
}
