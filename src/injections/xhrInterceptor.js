import {correctArrayKeys} from '../common/protojs';
import * as utils from '../xhrInterceptor/utils.js';

const originalOpen = window.XMLHttpRequest.prototype.open;
const originalSetRequestHeader =
    window.XMLHttpRequest.prototype.setRequestHeader;
const originalSend = window.XMLHttpRequest.prototype.send;

let messageID = 0;

class XHRProxy {
  constructor() {
    this.originalXMLHttpRequest = window.XMLHttpRequest;
    const originalXMLHttpRequest = this.originalXMLHttpRequest;

    this.messageID = 0;

    window.XMLHttpRequest = function() {
      this.xhr = new originalXMLHttpRequest();
      this.$TWPTID = messageID++;
    };

    const methods = [
      'open', 'abort', 'setRequestHeader', 'send', 'addEventListener',
      'removeEventListener', 'getResponseHeader', 'getAllResponseHeaders',
      'dispatchEvent', 'overrideMimeType'
    ];
    methods.forEach(method => {
      window.XMLHttpRequest.prototype[method] = function() {
        const proxyThis = this;

        switch (method) {
          case 'open':
            this.$TWPTRequestURL = arguments[1] || location.href;

            var interceptors =
                utils.matchInterceptors('response', this.$TWPTRequestURL);
            if (interceptors.length > 0) {
              this.xhr.addEventListener('load', function() {
                var body = utils.getResponseJSON(this);
                if (body !== undefined)
                  interceptors.forEach(i => {
                    utils.triggerEvent(i.eventName, body, proxyThis.$TWPTID);
                  });
              });
            }
            break;

          case 'setRequestHeader':
            let header = arguments[0];
            let value = arguments[1];
            if ('Content-Type'.localeCompare(
                    header, undefined, {sensitivity: 'accent'}) == 0)
              this.$isArrayProto = (value == 'application/json+protobuf');
            break;

          case 'send':
            var interceptors = utils.matchInterceptors(
                'request', this.$TWPTRequestURL || location.href);
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
                    'Unexpected type of request body (' + typeof (rawBody) +
                        ').',
                    this.$TWPTRequestURL);
                return;
              }

              let JSONBody = JSON.parse(body);
              if (this.$isArrayProto) JSONBody = correctArrayKeys(JSONBody);

              interceptors.forEach(i => {
                utils.triggerEvent(i.eventName, JSONBody, this.$TWPTID);
              });
            }
            break;
        }
        return this.xhr[method].apply(this.xhr, arguments);
      };
    });

    const scalars = [
      'onabort',
      'onerror',
      'onload',
      'onloadstart',
      'onloadend',
      'onprogress',
      'onreadystatechange',
      'readyState',
      'response',
      'responseText',
      'responseType',
      'responseXML',
      'status',
      'statusText',
      'upload',
      'withCredentials',
      'DONE',
      'UNSENT',
      'HEADERS_RECEIVED',
      'LOADING',
      'OPENED'
    ];
    scalars.forEach(scalar => {
      Object.defineProperty(window.XMLHttpRequest.prototype, scalar, {
        get: function() {
          return this.xhr[scalar];
        },
        set: function(val) {
          this.xhr[scalar] = val;
        },
      });
    });

    return this;
  }
}

new XHRProxy();
