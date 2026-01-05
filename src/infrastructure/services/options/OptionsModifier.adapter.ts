import { SyncStorageAreaRepositoryPort } from '@/storage/repositories/syncStorageAreaRepository.port';
import {
  OptionCodename,
  OptionsValues,
} from '../../../common/options/optionsPrototype';
import { OptionsModifierPort } from '../../../services/options/OptionsModifier.port';

export class OptionsModifierAdapter implements OptionsModifierPort {
  constructor(
    private readonly syncStorageAreaRepository: SyncStorageAreaRepositoryPort,
  ) {}

  async set<O extends OptionCodename>(
    option: O,
    value: OptionsValues[O],
  ): Promise<void> {
    await this.syncStorageAreaRepository.set({ [option]: value });
  }
}
