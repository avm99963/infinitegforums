const createMessageRemoveParentRef = {
  urlRegex: /api\/CreateMessage/i,
  featureGated: true,
  features: ['flattenthreads', 'flattenthreads_switch_enabled'],
  isEnabled(options) {
    return options['flattenthreads'] &&
        options['flattenthreads_switch_enabled'];
  },
  async interceptor(_request, response) {
    // Remove parent_message_id value (field 37)
    delete response[37];
    return response;
  }
};

export default createMessageRemoveParentRef;
