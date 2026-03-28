import { SoftLockCheckboxInjectorPort } from '@/features/replySoftLock/ui/injectors/softLockCheckbox.injector';

export class SoftLockCheckboxInjectorAdapter implements SoftLockCheckboxInjectorPort {
  execute({
    element,
    position,
  }: {
    element: Element;
    position: 'start' | 'end';
  }): void {
    const contextProvider = document.createElement(
      'twpt-reply-soft-lock-checkbox-context-provider',
    );
    const checkbox = document.createElement('twpt-soft-lock-checkbox');
    contextProvider.append(checkbox);

    if (position === 'start') {
      element.prepend(contextProvider);
    } else {
      element.append(contextProvider);
    }
  }
}
