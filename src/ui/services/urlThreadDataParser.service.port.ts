export interface ThreadData {
  forumId: string;
  threadId: string;
  messageId?: string;
}

export interface UrlThreadDataParserServicePort {
  execute(url: string): ThreadData;
}
