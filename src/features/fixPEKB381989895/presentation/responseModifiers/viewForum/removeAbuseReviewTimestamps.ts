import { ProtobufObject } from '@/common/protojs/protojs.types';
import { ResponseModifier } from '@/xhrInterceptor/responseModifier/types';

const removeAbuseReviewTimestampsFromViewForum: ResponseModifier = {
  urlRegex: /api\/ViewForum/i,
  isEnabled(optionsConfiguration) {
    return optionsConfiguration.isEnabled('fixpekb381989895');
  },
  async interceptor(response: ProtobufObject): Promise<ProtobufObject> {
    // This attemps to delete the
    // forum.requestor_user_profile.profile_abuse.manual_review_timestamp_micro
    // field.
    if (response?.[1]?.[6]?.[8]?.[6]) {
      delete response[1][6][8][6];
    }
    return response;
  },
};

export default removeAbuseReviewTimestampsFromViewForum;
