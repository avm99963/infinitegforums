import { ResponseModifier } from '../responseModifier/types';

const createMessageRemoveParentRef: ResponseModifier = {
  urlRegex: /api\/CreateMessage/i,
  isEnabled(optionsConfiguration) {
    return (
      optionsConfiguration.isEnabled('flattenthreads') &&
      optionsConfiguration.isEnabled('flattenthreads_switch_enabled')
    );
  },
  async interceptor(response) {
    // Remove parent_message_id value (field 37)
    delete response[37];
    return response;
  },
};

export default createMessageRemoveParentRef;
