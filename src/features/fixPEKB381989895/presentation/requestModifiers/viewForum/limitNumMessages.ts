import { ProtobufObject } from '@/common/protojs/protojs.types';
import { RequestModifier } from '@/xhrInterceptor/requestModifier/types';

const limitViewForumMessages: RequestModifier = {
  urlRegex: /api\/ViewForum/i,
  isEnabled(optionsConfiguration) {
    return optionsConfiguration.isEnabled('fixpekb381989895');
  },
  async interceptor(body: ProtobufObject): Promise<ProtobufObject> {
    const maxNum = body?.[2]?.[1]?.[2]; // options.pagination.max_num
    // In this case, the request is for fetching message count, and showing it
    // in the sidebar. We want to make these requests NOOP since they aren't
    // useful for PEs.
    if (maxNum === 1000) {
      // Modify max_num to 0 (effectively fetching no messages).
      body[2][1][2] = 0;
    }

    return body;
  },
};

export default limitViewForumMessages;
