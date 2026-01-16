import {
  ItemToReport,
  MessageInfoRepositoryPort,
} from '../../ui/injectors/bulkReportControls.injector.adapter';

export class MessageInfoRepositoryAdapter implements MessageInfoRepositoryPort {
  getInfo(elementInsideMessage: Element): ItemToReport {
    return {
      forumId: this.getForumId(),
      threadId: this.getThreadId(),
      messageId: this.getMessageId(elementInsideMessage),
    };
  }

  private getForumId() {
    const result = window.location.href.match(/forum\/([0-9]+)/i);
    if (result === null) {
      throw new Error("Couldn't obtain forum id.");
    }
    return result[1];
  }

  private getThreadId() {
    const result = window.location.href.match(/thread\/([0-9]+)/i);
    if (result === null) {
      throw new Error("Couldn't obtain thread id.");
    }
    return result[1];
  }

  private getMessageId(elementInsideMessage: Element) {
    const messageElement = elementInsideMessage.closest(
      '.scTailwindThreadMessageMessagecardcontent, .scTailwindThreadMessageCommentcardnested-reply',
    );
    if (messageElement === null) {
      throw new Error(
        "Couldn't obtain thread id because the message element couldn't be found.",
      );
    }

    const messageId = messageElement.getAttribute('data-stats-id');
    if (messageId === null) {
      throw new Error(
        "Couldn't obtain thread id because the data-stats-id attribute doesn't exist.",
      );
    }

    return messageId;
  }
}
