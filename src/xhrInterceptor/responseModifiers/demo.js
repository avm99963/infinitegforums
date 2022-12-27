export default {
  urlRegex: /api\/ViewForum/i,
  featureGated: true,
  features: ['demo1', 'demo2'],
  isEnabled(features) {
    return features['demo1'] || features['demo2'];
  },
  interceptor(_request, _response) {
    return Promise.resolve({
      1: {
        2: [],
        4: 0,
        6: {},
        7: {},
      },
    });
  },
};
