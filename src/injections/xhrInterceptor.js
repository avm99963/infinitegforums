import * as utils from '../common/xhrInterceptorUtils.js';

const originalOpen = XMLHttpRequest.prototype.open;
const originalSend = XMLHttpRequest.prototype.send;

let messageID = 0;

XMLHttpRequest.prototype.open = function() {
  this.$TWPTRequestURL = arguments[1] || location.href;
  this.$TWPTID = messageID++;

  let interceptors = utils.matchInterceptors('response', this.$TWPTRequestURL);
  if (interceptors.length > 0) {
    this.addEventListener('load', function() {
      var body = utils.getResponseJSON(this);
      if (body !== undefined)
        interceptors.forEach(i => {
          utils.triggerEvent(i.eventName, body, this.$TWPTID);
        });
    });
  }

  originalOpen.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function() {
  originalSend.apply(this, arguments);

  let interceptors =
      utils.matchInterceptors('request', this.$TWPTRequestURL || location.href);
  if (interceptors.length > 0) {
    var rawBody = arguments[0];
    if (typeof (rawBody) !== 'object' ||
        !(rawBody instanceof Object.getPrototypeOf(Uint8Array))) {
      console.error(
          'Request body is not Uint8Array, but ' + typeof (rawBody) + '.',
          this.$TWPTRequestUrl);
      return;
    }

    var dec = new TextDecoder('utf-8');
    var body = dec.decode(rawBody);
    var JSONBody = JSON.parse(body);

    interceptors.forEach(i => {
      utils.triggerEvent(i.eventName, JSONBody, this.$TWPTID);
    });
  }
};
