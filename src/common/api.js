const CC_API_BASE_URL = 'https://support.google.com/s/community/api/';

// Function to wrap calls to the Community Console API with intelligent error
// handling.
export function CCApi(
    method, data, authenticated, authuser = 0,
    returnUnauthorizedStatus = false) {
  var authuserPart =
      authuser == '0' ? '' : '?authuser=' + encodeURIComponent(authuser);

  return fetch(CC_API_BASE_URL + method + authuserPart, {
           'headers': {
             'content-type': 'text/plain; charset=utf-8',
           },
           'body': JSON.stringify(data),
           'method': 'POST',
           'mode': 'cors',
           'credentials': (authenticated ? 'include' : 'omit'),
         })
      .then(res => {
        if (res.status == 200 || res.status == 400) {
          return res.json().then(data => ({
                                   status: res.status,
                                   body: data,
                                 }));
        } else {
          throw new Error(
              'Status code ' + res.status + ' was not expected when calling ' +
              method + '.');
        }
      })
      .then(res => {
        if (res.status == 400) {
          // If the canonicalCode is PERMISSION_DENIED:
          if (returnUnauthorizedStatus && res.body?.[2] == 7)
            return {
              unauthorized: true,
            };

          throw new Error(
              res.body[4] ||
              ('Response status 400 for method ' + method + '. ' +
               'Error code: ' + (res.body[2] ?? 'unknown')));
        }

        if (returnUnauthorizedStatus)
          return {
            unauthorized: false,
            body: res.body,
          };

        return res.body;
      });
}
