import {waitFor} from 'poll-until-promise';

import {correctArrayKeys} from '../common/protojs';
import ResponseModifier from '../xhrInterceptor/responseModifiers/index.js';
import * as utils from '../xhrInterceptor/utils.js';

const kSpecialEvents = ['load', 'loadend'];
const kErrorEvents = ['error', 'timeout', 'abort'];

const kCheckInterceptionOptions = {
  interval: 50,
  timeout: 100 * 1000,
};

function flattenOptions(options) {
  if (typeof options === 'boolean') return options;
  if (options) return options['capture'];
  return undefined;
}

// Slightly based in https://stackoverflow.com/a/24561614.
export default class XHRProxy {
  constructor() {
    this.originalXMLHttpRequest = window.XMLHttpRequest;
    const classThis = this;

    this.messageID = 0;
    this.responseModifier = new ResponseModifier();

    window.XMLHttpRequest = function() {
      this.xhr = new classThis.originalXMLHttpRequest();
      this.$TWPTID = classThis.messageID++;
      this.$responseModified = false;
      this.$responseIntercepted = false;
      this.specialHandlers = {
        load: new Set(),
        loadend: new Set(),
      };

      const proxyThis = this;
      kSpecialEvents.forEach(eventName => {
        this.xhr.addEventListener(eventName, function() {
          let p;
          if (eventName === 'load') {
            p = classThis.responseModifier.intercept(proxyThis).then(() => {
              proxyThis.$responseIntercepted = true;
            });
          } else {
            p = waitFor(() => {
              if (proxyThis.$responseIntercepted) return Promise.resolve();
              return Promise.reject();
            }, kCheckInterceptionOptions);
          }

          p.then(() => {
            for (const e of proxyThis.specialHandlers[eventName]) {
              e[1](arguments);
            }
          });
        });
      });
      kErrorEvents.forEach(eventName => {
        this.xhr.addEventListener(eventName, function() {
          proxyThis.$responseIntercepted = true;
        });
      });
    };

    const methods = [
      'open', 'abort', 'setRequestHeader', 'send', 'getResponseHeader',
      'getAllResponseHeaders', 'dispatchEvent', 'overrideMimeType'
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
                var body = utils.getResponseJSON({
                  responseType: proxyThis.xhr.responseType,
                  response: proxyThis.xhr.response,
                  $TWPTRequestURL: proxyThis.$TWPTRequestURL,
                  $isArrayProto: proxyThis.$isArrayProto,
                });
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

    window.XMLHttpRequest.prototype.addEventListener = function() {
      if (!kSpecialEvents.includes(arguments[0]))
        return this.xhr.addEventListener.apply(this.xhr, arguments);

      this.specialHandlers[arguments[0]].add(arguments);
    };

    window.XMLHttpRequest.prototype.removeEventListener = function(
        type, callback, options) {
      if (!kSpecialEvents.includes(type))
        return this.xhr.removeEventListener.apply(this.xhr, arguments);

      const flattenedOptions = flattenOptions(options);
      for (const e of this.specialHandlers[type]) {
        if (callback === e[1] && flattenOptions(e[2]) === flattenedOptions) {
          return this.specialHandlers[type].delete(e);
        }
      }
    };

    const scalars = [
      'onabort',
      'onerror',
      'onload',
      'onloadstart',
      'onloadend',
      'onprogress',
      'onreadystatechange',
      'readyState',
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

    Object.defineProperty(window.XMLHttpRequest.prototype, 'response', {
      get: function() {
        if (!this.$responseIntercepted) return undefined;
        if (this.$responseModified) return this.$newResponse;
        return this.xhr.response;
      },
    });
    Object.defineProperty(window.XMLHttpRequest.prototype, 'originalResponse', {
      get: function() {
        return this.xhr.response;
      },
    });
    Object.defineProperty(window.XMLHttpRequest.prototype, 'responseText', {
      get: function() {
        if (!this.$responseIntercepted) return undefined;
        if (this.$responseModified) return this.$newResponseText;
        return this.xhr.responseText;
      },
    });

    return this;
  }
}
