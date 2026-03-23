import { OptionsConfiguration } from '@/common/options/OptionsConfiguration';
import { ProtobufNumber, ProtobufObject } from '@/common/protojs/protojs.types';
import { ReplySoftLockUserSelectionRepositoryPort } from '@/features/replySoftLock/repositories/userSelection.repository.port';
import { CommunityConsoleApiClientPort } from '@/services/communityConsole/api/CommunityConsoleApiClient.port';
import { RequestModifier } from '@/xhrInterceptor/requestModifier/types';

const SET_THREAD_ATTRIBUTE_ACTION_SOFT_LOCK = 12;

/**
 * This request modifier doesn't actually modify requests to CreateMessage, but
 * intercepts them when the `replysoftlock` option is enabled to soft lock the
 * thread if the "soft lock" option was selected when replying.
 */
export class SoftLockAfterReplyRequestModifier implements RequestModifier {
  constructor(
    private readonly repository: ReplySoftLockUserSelectionRepositoryPort,
    private readonly apiClient: CommunityConsoleApiClientPort,
  ) {}

  readonly urlRegex = /api\/CreateMessage/i;

  isEnabled(optionsConfiguration: OptionsConfiguration) {
    return optionsConfiguration.isEnabled('replysoftlock');
  }

  // We set body to Readonly so we don't modify it accidentally.
  async interceptor(body: Readonly<ProtobufObject>): Promise<ProtobufObject> {
    const forumId = body?.[1];
    const threadId = body?.[2];
    if (forumId === undefined || threadId === undefined) {
      throw new Error(
        'Expected forumId and threadId to be set in CreateMessage request.',
      );
    }

    const shouldSoftLock = await this.repository.shouldSoftLock();

    // Clear the state immediately so it doesn't leak into future requests.
    await this.repository.setShouldSoftLock(false);

    if (shouldSoftLock) {
      // NOTE: We execute this request in parallel with the original
      // CreateMessage request because independently of which one finishes
      // first, the thread will not show the updated soft lock state until it is
      // manually reloaded by the user.
      //
      // So parallelizing the requests will allow them to finish sooner.
      this.softLockThread(forumId, threadId);
    }

    return body;
  }

  private async softLockThread(
    forumId: ProtobufNumber,
    threadId: ProtobufNumber,
  ) {
    try {
      await this.apiClient.send('SetThreadAttribute', {
        1: forumId,
        2: threadId,
        3: SET_THREAD_ATTRIBUTE_ACTION_SOFT_LOCK,
      });
    } catch (e) {
      // If it fails, we want to log/show an error, but we want the creation of
      // the message to succeed.
      // TODO: show a snackbar to the user with the error.
      console.error(
        '[replySoftLock] Failed to soft lock the thread while posting a reply:',
        e,
      );
    }
  }
}
