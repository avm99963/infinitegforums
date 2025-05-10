import {
  ThreadData,
  UrlThreadDataParserServicePort,
} from '../../../../ui/services/urlThreadDataParser.service.port';

export class UrlThreadDataParserServiceAdapter
  implements UrlThreadDataParserServicePort
{
  execute(url: string): ThreadData {
    const forumMatches = url.match(/forum\/([0-9]+)/i);
    const threadMatches = url.match(/thread\/([0-9]+)/i);
    const messageMatches = url.match(/message\/([0-9]+)/i);

    if (forumMatches === null || threadMatches === null) {
      throw new Error(`Could not parse thread data from URL "${url}".`);
    }

    return {
      forumId: forumMatches[1],
      threadId: threadMatches[1],
      ...(messageMatches !== null ? { messageId: messageMatches[1] } : {}),
    };
  }
}
