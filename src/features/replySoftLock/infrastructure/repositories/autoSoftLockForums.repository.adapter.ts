import { OptionsProviderPort } from '@/services/options/OptionsProvider';
import { AutoSoftLockForumsRepositoryPort } from '../../repositories/autoSoftLockForums.repository.port';
import { OptionsModifierPort } from '@/services/options/OptionsModifier.port';

export class AutoSoftLockForumsRepositoryAdapter implements AutoSoftLockForumsRepositoryPort {
  constructor(
    private readonly optionsProvider: OptionsProviderPort,
    private readonly optionsModifier: OptionsModifierPort,
  ) {}

  async get(): Promise<string[]> {
    const forumIds = await this.optionsProvider.getOptionValue(
      'replysoftlock_autosoftlockforums',
    );

    // Do some validation since the option is quite complex, and there could be
    // an edge case in which we have saved a non-valid value, even if the types
    // match.
    if (!Array.isArray(forumIds)) {
      console.error(
        'AutoSoftLockForumsRepositoryAdapter: the saved value for replysoftlock_autosoftlockforums is not an array. Instead, we got:',
        forumIds,
      );
      return [];
    }

    const sanitizedForumIds = forumIds.filter((id) => typeof id === 'string');
    return sanitizedForumIds;
  }

  async setAutoSoftLock(forumId: string, enable: boolean): Promise<void> {
    const forumIds = await this.get();

    if (enable) {
      this.addForum(forumIds, forumId);
    } else {
      this.removeForum(forumIds, forumId);
    }

    await this.optionsModifier.set(
      'replysoftlock_autosoftlockforums',
      forumIds,
    );
  }

  private addForum(forumIds: string[], forumId: string) {
    if (!forumIds.includes(forumId)) {
      forumIds.push(forumId);
    }
  }

  private removeForum(forumIds: string[], forumId: string) {
    const index = forumIds.indexOf(forumId);
    if (index !== -1) {
      forumIds.splice(index, 1);
    }
  }
}
