import xhrInterceptors from './xhrInterceptors.json5';

export {xhrInterceptors};

export function matchInterceptors(interceptFilter, url) {
  return xhrInterceptors.interceptors.filter(interceptor => {
    var regex = new RegExp(interceptor.urlRegex);
    return interceptor.intercepts == interceptFilter && regex.test(url);
  });
}

export function getResponseJSON(xhr) {
  if (xhr.responseType === 'arraybuffer') {
    var arrBuffer = xhr.response;
    if (!arrBuffer) {
      console.error('No array buffer.');
      return undefined;
    }
    var byteArray = new Uint8Array(arrBuffer);
    var dec = new TextDecoder('utf-8');
    var rawResponse = dec.decode(byteArray);
    return JSON.parse(rawResponse);
  }
  if (xhr.responseType === 'text' || xhr.responseType === '')
    return JSON.parse(xhr.responseText);
  if (xhr.responseType === 'json') return xhr.response;

  console.error(
      'Unexpected responseType ' + xhr.responseType + '. Request url: ',
      xhr.$TWPTRequestURL);
  return undefined;
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
