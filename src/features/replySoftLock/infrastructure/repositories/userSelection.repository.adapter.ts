import { ReplySoftLockUserSelectionRepositoryPort } from '../../repositories/userSelection.repository.port';
import { UrlThreadDataParserServicePort } from '@/ui/services/urlThreadDataParser.service.port';

/**
 * Adapter that saves the user selection global state into window.
 *
 * Note that, for this to work, all users of this repository must live in the
 * same world.
 *
 * In particular, one of its users (the Lit component) lives in the main world,
 * so all other users must also live in the main world (this is also the case,
 * since the other user is the request modifier that also lives there).
 */
export class ReplySoftLockUserSelectionRepositoryAdapter implements ReplySoftLockUserSelectionRepositoryPort {
  constructor(
    private readonly urlThreadDataParser: UrlThreadDataParserServicePort,
  ) {}

  async setShouldSoftLock(enable: boolean): Promise<void> {
    window.twptReplySoftLockStatus = {
      shouldSoftLock: enable,
      threadId: this.getCurrentThreadId(),
    };
  }

  async shouldSoftLock(): Promise<boolean> {
    const status = window.twptReplySoftLockStatus;
    const currentThreadId = this.getCurrentThreadId();

    return (
      status !== undefined &&
      status.threadId === currentThreadId &&
      status.shouldSoftLock
    );
  }

  private getCurrentThreadId(): string {
    try {
      const currentThread = this.urlThreadDataParser.execute(
        window.location.href,
      );
      return currentThread.threadId;
    } catch (e) {
      throw new Error(
        "Couldn't get current thread id when saving/retrieving the soft lock checkbox state.",
        { cause: e },
      );
    }
  }
}

declare global {
  interface Window {
    twptReplySoftLockStatus?: {
      threadId: string;
      shouldSoftLock: boolean;
    };
  }
}
