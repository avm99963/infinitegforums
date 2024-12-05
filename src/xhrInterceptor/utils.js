import {correctArrayKeys, inverseCorrectArrayKeys} from '../common/protojs';

import xhrInterceptors from './interceptors/interceptors';

/**
 * @deprecated Use `InterceptorHandler`.
 */
export function matchInterceptors(interceptFilter, url) {
  return xhrInterceptors.interceptors.filter(interceptor => {
    var regex = new RegExp(interceptor.urlRegex);
    return interceptor.intercepts == interceptFilter && regex.test(url);
  });
}

export function getResponseText(xhr, transformArrayPb = true) {
  let response;
  if (xhr.responseType === 'arraybuffer') {
    var arrBuffer = xhr.response;
    if (!arrBuffer) {
      console.error('No array buffer.');
      return undefined;
    }
    let byteArray = new Uint8Array(arrBuffer);
    let dec = new TextDecoder('utf-8');
    response = dec.decode(byteArray);
  } else if (xhr.responseType === 'text' || xhr.responseType === '') {
    response = xhr.responseText;
  } else if (xhr.responseType === 'json') {
    response = JSON.stringify(xhr.response);
  } else {
    console.error(
        'Unexpected responseType ' + xhr.responseType + '. Request url: ',
        xhr.$TWPTRequestURL);
    return undefined;
  }

  if (xhr.$isArrayProto && transformArrayPb)
    response = correctArrayKeys(response);

  return response;
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
    response = JSON.parse(xhr.response);
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

export function convertJSONToResponse(xhr, json) {
  if (xhr.$isArrayProto) json = inverseCorrectArrayKeys(json);

  switch (xhr.responseType) {
    case 'json':
      return json;

    case 'text':
    case '':
      return JSON.stringify(json);

    case 'arraybuffer':
      var encoder = new TextEncoder();
      return encoder.encode(JSON.stringify(json)).buffer;

    default:
      console.error(
          'Unexpected responseType ' + xhr.responseType + '. Request url: ',
          xhr.$TWPTRequestURL || xhr.responseURL);
      return undefined;
  }
}

export function convertJSONToResponseText(xhr, json) {
  return convertJSONToResponse(
      {
        $isArrayProto: xhr.$isArrayProto,
        responseType: 'text',
      },
      json);
}

/**
 * @deprecated Use `InterceptorHandler`.
 */
export function triggerEvent(eventName, body, id) {
  var evt = new CustomEvent('TWPT_' + eventName, {
    detail: {
      body,
      id,
    }
  });
  window.dispatchEvent(evt);
}
