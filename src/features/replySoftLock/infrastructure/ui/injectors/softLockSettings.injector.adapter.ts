import { SoftLockSettingsInjectorPort } from '@/features/replySoftLock/ui/injectors/softLockSettings.injector';

export class SoftLockSettingsInjectorAdapter implements SoftLockSettingsInjectorPort {
  execute({
    element,
    position,
  }: {
    element: Element;
    position: 'start' | 'end';
  }): void {
    const contextProvider = document.createElement(
      'twpt-reply-soft-lock-settings-context-provider',
    );
    const settings = document.createElement('twpt-soft-lock-settings');
    contextProvider.append(settings);

    if (position === 'start') {
      element.prepend(contextProvider);
    } else if (position === 'end') {
      element.append(contextProvider);
    }
  }
}
