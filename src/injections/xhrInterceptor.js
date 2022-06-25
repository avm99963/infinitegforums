import {correctArrayKeys} from '../common/protojs';
import * as utils from '../common/xhrInterceptorUtils.js';

const originalOpen = window.XMLHttpRequest.prototype.open;
const originalSetRequestHeader =
    window.XMLHttpRequest.prototype.setRequestHeader;
const originalSend = window.XMLHttpRequest.prototype.send;

let messageID = 0;

window.XMLHttpRequest.prototype.open = function() {
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

window.XMLHttpRequest.prototype.setRequestHeader = function() {
  originalSetRequestHeader.apply(this, arguments);

  let header = arguments[0];
  let value = arguments[1];
  if ('Content-Type'.localeCompare(
          header, undefined, {sensitivity: 'accent'}) == 0)
    this.$isArrayProto = (value == 'application/json+protobuf');
};

window.XMLHttpRequest.prototype.send = function() {
  originalSend.apply(this, arguments);

  let interceptors =
      utils.matchInterceptors('request', this.$TWPTRequestURL || location.href);
  if (interceptors.length > 0) {
    let rawBody = arguments[0];
    let body;
    if (typeof (rawBody) === 'object' &&
        (rawBody instanceof Object.getPrototypeOf(Uint8Array))) {
      let dec = new TextDecoder('utf-8');
      body = dec.decode(rawBody);
    } else if (typeof (rawBody) === 'string') {
      body = rawBody;
    } else {
      console.error(
          'Unexpected type of request body (' + typeof (rawBody) + ').',
          this.$TWPTRequestURL);
      return;
    }

    let JSONBody = JSON.parse(body);
    if (this.$isArrayProto) JSONBody = correctArrayKeys(JSONBody);

    interceptors.forEach(i => {
      utils.triggerEvent(i.eventName, JSONBody, this.$TWPTID);
    });
  }
};
