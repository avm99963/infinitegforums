import {
  GetSelectedThreadsServicePort,
  SelectedThread,
} from '../../../../ui/services/getSelectedThreads.service.port';
import {
  ThreadData,
  UrlThreadDataParserServicePort,
} from '../../../../ui/services/urlThreadDataParser.service.port';
import { UnexpectedUIError } from '../../../../ui/errors/unexpectedUI.error';

export class GetSelectedThreadsServiceAdapter
  implements GetSelectedThreadsServicePort
{
  constructor(
    private readonly urlThreadDataParser: UrlThreadDataParserServicePort,
  ) {}

  execute(): SelectedThread[] {
    const threadCheckboxes = document.querySelectorAll(
      '.thread-group material-checkbox[aria-checked="true"]',
    );
    const threads: SelectedThread[] = [];
    for (const checkbox of threadCheckboxes) {
      const thread = this.getThreadDataFromCheckbox(checkbox);
      if (thread !== undefined) {
        threads.push(thread);
      }
    }
    return threads;
  }

  private getThreadDataFromCheckbox(
    checkbox: Element,
  ): SelectedThread | undefined {
    try {
      const threadSummary = checkbox.closest('ec-thread-summary');
      if (threadSummary === null) {
        throw new UnexpectedUIError(
          "The ec-thread-summary element doesn't exist.",
        );
      }
      const threadData = this.parseThreadData(threadSummary);
      const threadTitle = this.getThreadTitle(threadSummary);
      return {
        forumId: threadData.forumId,
        id: threadData.threadId,
        title: threadTitle,
      };
    } catch (e) {
      console.error(
        e,
        'The error occurred while trying to obtain thread data from the following selected checkbox:',
        checkbox,
        'This thread will be skipped, but the data from other selected threads might have been correctly retrieved.',
      );
      return undefined;
    }
  }

  private parseThreadData(threadSummary: Element): ThreadData | undefined {
    const link = threadSummary.querySelector('a.header-content');
    if (!(link instanceof HTMLAnchorElement)) {
      throw new UnexpectedUIError(
        'The thread link element is not actually an anchor element.',
      );
    }
    const url = link.href;
    return this.urlThreadDataParser.execute(url);
  }

  private getThreadTitle(threadSummary: Element) {
    const titleElement = threadSummary.querySelector('.title-text');
    if (titleElement === null) {
      console.error(
        new UnexpectedUIError(
          "The .title-text element doesn't exist, while trying to retrieve the thread title.",
        ),
        'The error occurred while trying to obtain the thread title from the following thread:',
        threadSummary,
      );
    }
    return titleElement?.textContent.trim();
  }
}
