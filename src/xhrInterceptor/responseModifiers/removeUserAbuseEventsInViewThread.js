/**
 * @deprecated The feature behind this response modifier has been deprecated.
 * This code will soon be removed once we're sure the feature won't come back.
 */
const removeUserAbuseEventsInViewThread = {
  urlRegex: /api\/ViewThread/i,
  featureGated: true,
  features: ['fixpekb269560789'],
  isEnabled(options) {
    return options['fixpekb269560789'];
  },
  async interceptor(_, response) {
    if (response?.[1]?.[13]?.[8]?.[7]) {
      delete response[1][13][8][7];
    }
    return response;
  },
};

export default removeUserAbuseEventsInViewThread;
