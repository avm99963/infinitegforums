import { SoftLockCheckboxInjectorPort } from '@/features/replySoftLock/ui/injectors/softLockCheckbox.injector';

export class SoftLockCheckboxInjectorAdapter implements SoftLockCheckboxInjectorPort {
  execute({
    element,
    position,
  }: {
    element: Element;
    position: 'start' | 'end' | 'before';
  }): void {
    const contextProvider = document.createElement(
      'twpt-reply-soft-lock-checkbox-context-provider',
    );
    const checkbox = document.createElement('twpt-soft-lock-checkbox');
    contextProvider.append(checkbox);

    if (position === 'start') {
      element.prepend(contextProvider);
    } else if (position === 'end') {
      element.append(contextProvider);
    } else if (position === 'before') {
      element.before(contextProvider);
    }
  }
}
