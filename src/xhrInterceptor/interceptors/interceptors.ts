import { Interceptor } from './InterceptorHandler.port';

const interceptors: { interceptors: Interceptor[] } = {
  interceptors: [
    {
      eventName: 'ViewForumRequest',
      urlRegex: /api\/ViewForum/,
      intercepts: 'request',
    },
    {
      eventName: 'ViewForumResponse',
      urlRegex: /api\/ViewForum/,
      intercepts: 'response',
    },
    {
      eventName: 'CreateMessageRequest',
      urlRegex: /api\/CreateMessage/,
      intercepts: 'request',
    },
    {
      eventName: 'ViewUnifiedUserResponse',
      urlRegex: /api\/ViewUnifiedUser/,
      intercepts: 'response',
    },
    {
      eventName: 'ListCannedResponsesResponse',
      urlRegex: /api\/ListCannedResponses/,
      intercepts: 'response',
    },
    {
      eventName: 'ViewThreadResponse',
      urlRegex: /api\/ViewThread/,
      intercepts: 'response',
    },
  ],
};

export default interceptors;
