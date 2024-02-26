import {waitFor} from 'poll-until-promise';

import {correctArrayKeys} from '../common/protojs';
import ResponseModifier from '../xhrInterceptor/responseModifiers/index.js';
import * as utils from '../xhrInterceptor/utils.js';

const kSpecialEvents = ['load', 'loadend'];
const kErrorEvents = ['error', 'timeout', 'abort'];

const kStandardMethods = [
  'open', 'abort', 'setRequestHeader', 'send', 'getResponseHeader',
  'getAllResponseHeaders', 'dispatchEvent', 'overrideMimeType'
];
const kStandardScalars = [
  'onabort',
  'onerror',
  'onload',
  'onloadstart',
  'onloadend',
  'onprogress',
  'onreadystatechange',
  'readyState',
  'responseType',
  'responseURL',
  'responseXML',
  'status',
  'statusText',
  'upload',
  'withCredentials',
  'DONE',
  'UNSENT',
  'HEADERS_RECEIVED',
  'LOADING',
  'OPENED',
];

const kCheckInterceptionOptions = {
  interval: 50,
  timeout: 100 * 1000,
};

/**
 * Implements the flatten options concept of the DOM spec.
 *
 * @see {@link https://dom.spec.whatwg.org/#concept-flatten-options}
 */
function flattenOptions(options) {
  if (typeof options === 'boolean') return options;
  if (options) return options['capture'];
  return undefined;
}

/**
 * Class which, when instantiated, overrides window.XMLHttpRequest to proxy the
 * requests through our internal interceptors to read/modify requests/responses.
 *
 * Slightly based in https://stackoverflow.com/a/24561614.
 */
export default class XHRProxy {
  constructor() {
    this.originalXMLHttpRequest = window.XMLHttpRequest;

    this.messageID = 0;
    this.responseModifier = new ResponseModifier();

    this.#overrideXHRObject();
  }

  #overrideXHRObject() {
    this.#overrideConstructor();
    this.#addProxyEventsMethods();
    this.#overrideMethods();
    this.#addMethodInterceptors();
    this.#overrideScalars();
    this.#setOriginalResponseScalar();
  }

  #overrideConstructor() {
    const XHRProxyInstance = this;

    window.XMLHttpRequest = function() {
      this.xhr = new XHRProxyInstance.originalXMLHttpRequest();
      this.$TWPTID = XHRProxyInstance.messageID++;
      this.$responseModified = false;
      this.$responseIntercepted = false;
      this.specialHandlers = {
        load: new Set(),
        loadend: new Set(),
      };

      this.$proxyEvents();
    };
  }

  #addProxyEventsMethods() {
    window.XMLHttpRequest.prototype.$proxyEvents = function() {
      this.$proxySpecialEvents();
      this.$proxyErrorEvents();
    };
    this.#addProxySpecialEvents();
    this.#addProxyErrorEvents();
  }

  #overrideMethods() {
    this.#overrideStandardMethods();
    this.#overrideEventsMethods();
  }

  #addMethodInterceptors() {
    this.#addOpenInterceptor();
    this.#addSetRequestHeaderInterceptor();
    this.#addSendInterceptor();
  }

  #overrideScalars() {
    this.#overrideStandardScalars();
    this.#overrideResponseScalars();
  }

  #overrideStandardMethods() {
    kStandardMethods.forEach(method => {
      this.#overrideStandardMethod(method);
    });
  }

  #overrideEventsMethods() {
    this.#overrideAddEventListener();
    this.#overrideRemoveEventListener();
  }

  #overrideStandardScalars() {
    kStandardScalars.forEach(scalar => {
      this.#overrideStandardScalar(scalar);
    });
  }

  #overrideResponseScalars() {
    this.#overrideResponse();
    this.#overrideResponseText();
  }

  #addProxySpecialEvents() {
    const XHRProxyInstance = this;
    window.XMLHttpRequest.prototype.$proxySpecialEvents = function() {
      const proxyInstance = this;
      kSpecialEvents.forEach(eventName => {
        this.xhr.addEventListener(eventName, function() {
          let interceptedPromise;
          if (eventName === 'load') {
            interceptedPromise =
                XHRProxyInstance.responseModifier.intercept(proxyInstance)
                    .then(() => {
                      proxyInstance.$responseIntercepted = true;
                    });
          } else {
            interceptedPromise = waitFor(() => {
              if (proxyInstance.$responseIntercepted) return Promise.resolve();
              return Promise.reject();
            }, kCheckInterceptionOptions);
          }

          interceptedPromise.then(() => {
            for (const e of proxyInstance.specialHandlers[eventName]) {
              e[1](arguments);
            }
          });
        });
      });
    };
  }

  #addProxyErrorEvents() {
    window.XMLHttpRequest.prototype.$proxyErrorEvents = function() {
      const proxyInstance = this;
      kErrorEvents.forEach(eventName => {
        this.xhr.addEventListener(eventName, function() {
          proxyInstance.$responseIntercepted = true;
        });
      });
    }
  }

  #overrideStandardMethod(method) {
    window.XMLHttpRequest.prototype[method] = function() {
      if (method == 'open')
        this.$interceptOpen(...arguments);
      else if (method == 'setRequestHeader')
        this.$interceptSetRequestHeader(...arguments);
      else if (method == 'send')
        this.$interceptSend(...arguments);

      return this.xhr[method].apply(this.xhr, arguments);
    }
  }

  #overrideStandardScalar(scalar) {
    Object.defineProperty(window.XMLHttpRequest.prototype, scalar, {
      get: function() {
        return this.xhr[scalar];
      },
      set: function(val) {
        this.xhr[scalar] = val;
      },
    });
  }

  #overrideAddEventListener() {
    window.XMLHttpRequest.prototype.addEventListener = function() {
      if (!kSpecialEvents.includes(arguments[0]))
        return this.xhr.addEventListener.apply(this.xhr, arguments);

      this.specialHandlers[arguments[0]].add(arguments);
    };
  }

  #overrideRemoveEventListener() {
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
  }

  #addOpenInterceptor() {
    window.XMLHttpRequest.prototype.$interceptOpen = function() {
      const proxyInstance = this;

      this.$TWPTRequestURL = arguments[1] || location.href;

      var interceptors =
          utils.matchInterceptors('response', this.$TWPTRequestURL);
      if (interceptors.length > 0) {
        this.addEventListener('load', function() {
          var body = utils.getResponseJSON({
            responseType: proxyInstance.responseType,
            response: proxyInstance.response,
            $TWPTRequestURL: proxyInstance.$TWPTRequestURL,
            $isArrayProto: proxyInstance.$isArrayProto,
          });
          if (body !== undefined)
            interceptors.forEach(i => {
              utils.triggerEvent(i.eventName, body, proxyInstance.$TWPTID);
            });
        });
      }
    };
  }

  #addSetRequestHeaderInterceptor() {
    window.XMLHttpRequest.prototype.$interceptSetRequestHeader = function() {
      let header = arguments[0];
      let value = arguments[1];
      if ('Content-Type'.localeCompare(
              header, undefined, {sensitivity: 'accent'}) == 0)
        this.$isArrayProto = (value == 'application/json+protobuf');
    };
  }

  #addSendInterceptor() {
    window.XMLHttpRequest.prototype.$interceptSend = function() {
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
    }
  }

  #setOriginalResponseScalar() {
    Object.defineProperty(window.XMLHttpRequest.prototype, 'originalResponse', {
      get: function() {
        return this.xhr.response;
      },
    });
  }

  #overrideResponse() {
    Object.defineProperty(window.XMLHttpRequest.prototype, 'response', {
      get: function() {
        if (!this.$responseIntercepted) return undefined;
        if (this.$responseModified) return this.$newResponse;
        return this.xhr.response;
      },
    });
  }

  #overrideResponseText() {
    Object.defineProperty(window.XMLHttpRequest.prototype, 'responseText', {
      get: function() {
        if (!this.$responseIntercepted) return undefined;
        if (this.$responseModified) return this.$newResponseText;
        return this.xhr.responseText;
      },
    });
  }
}
