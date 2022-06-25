import {correctArrayKeys} from '../common/protojs';

import xhrInterceptors from './xhrInterceptors.json5';

export {xhrInterceptors};

export function matchInterceptors(interceptFilter, url) {
  return xhrInterceptors.interceptors.filter(interceptor => {
    var regex = new RegExp(interceptor.urlRegex);
    return interceptor.intercepts == interceptFilter && regex.test(url);
  });
}

export function getResponseJSON(xhr) {
  let response;
  if (xhr.responseType === 'arraybuffer') {
    var arrBuffer = xhr.response;
    if (!arrBuffer) {
      console.error('No array buffer.');
      return undefined;
    }
    let byteArray = new Uint8Array(arrBuffer);
    let dec = new TextDecoder('utf-8');
    let rawResponse = dec.decode(byteArray);
    response = JSON.parse(rawResponse);
  } else if (xhr.responseType === 'text' || xhr.responseType === '') {
    response = JSON.parse(xhr.responseText);
  } else if (xhr.responseType === 'json') {
    response = xhr.response;
  } else {
    console.error(
        'Unexpected responseType ' + xhr.responseType + '. Request url: ',
        xhr.$TWPTRequestURL);
    return undefined;
  }

  if (xhr.$isArrayProto) response = correctArrayKeys(response);
  return response;
}

export function triggerEvent(eventName, body, id) {
  var evt = new CustomEvent('TWPT_' + eventName, {
    detail: {
      body,
      id,
    }
  });
  window.dispatchEvent(evt);
}
