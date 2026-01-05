import { KillSwitchType } from '@/common/options/Option';
import { optionCodenames, optionsMap } from '@/common/options/optionsPrototype';
import { DefaultOptionsCommitterPort } from '@/options/services/DefaultOptionsCommitter.service.port';
import { OptionsModifierPort } from '@/services/options/OptionsModifier.port';
import { OptionsProviderPort } from '@/services/options/OptionsProvider';

export class DefaultOptionsCommitterAdapter implements DefaultOptionsCommitterPort {
  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly optionsModifier: OptionsModifierPort,
  ) {}

  async commit(): Promise<void> {
    const updates: Promise<void>[] = [];

    const optionsConfiguration =
      await this.optionsProvider.getOptionsConfiguration();
    for (const codename of optionCodenames) {
      const option = optionsMap.get(codename);
      const status = optionsConfiguration.optionsStatus[codename];
      if (
        status.isDefaultValue &&
        option.killSwitchType !== KillSwitchType.InternalKillSwitch &&
        option.killSwitchType !== KillSwitchType.Deprecated
      ) {
        updates.push(this.optionsModifier.set(codename, status.value));
      }
    }

    await Promise.all(updates);
  }
}
