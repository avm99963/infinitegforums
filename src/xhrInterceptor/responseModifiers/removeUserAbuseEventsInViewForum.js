/**
 * @deprecated The feature behind this response modifier has been deprecated.
 * This code will soon be removed once we're sure the feature won't come back.
 */
const removeUserAbuseEventsInViewForum = {
  urlRegex: /api\/ViewForum/i,
  featureGated: true,
  features: ['fixpekb269560789'],
  isEnabled(options) {
    return options['fixpekb269560789'];
  },
  async interceptor(_, response) {
    if (response?.[1]?.[6]?.[8]?.[7]) {
      delete response[1][6][8][7];
    }
    return response;
  },
};

export default removeUserAbuseEventsInViewForum;
