import {grantedOptPermissions, missingPermissions} from './optionsPermissions.js';
import optionsPrototype from './optionsPrototype.json5';
import specialOptions from './specialOptions.json5';

export {optionsPrototype, specialOptions};

// Adds missing options with their default value. If |dryRun| is set to false,
// they are also saved to the sync storage area.
export function cleanUpOptions(options, dryRun = false) {
  console.debug('[cleanUpOptions] Previous options', JSON.stringify(options));

  if (typeof options !== 'object' || options === null) options = {};

  var ok = true;
  for (const [opt, optMeta] of Object.entries(optionsPrototype)) {
    if (!(opt in options)) {
      ok = false;
      options[opt] = optMeta['defaultValue'];
    }
  }

  console.debug('[cleanUpOptions] New options', JSON.stringify(options));

  if (!ok && !dryRun) {
    chrome.storage.sync.set(options);
  }

  return options;
}

// This piece of code is used as part of the getOptions computation, and so
// isn't that useful. It's exported since we sometimes need to finish the
// computation in a service worker, where we have access to the
// chrome.permissions API.
//
// It accepts as an argument an object |items| with the same structure of the
// items saved in the sync storage area, and an array |permissionChecksFeatures|
// of features
export function disableItemsWithMissingPermissions(
    items, permissionChecksFeatures) {
  return grantedOptPermissions().then(grantedPerms => {
    let permissionChecksPromises = [];
    for (const f of permissionChecksFeatures)
      permissionChecksPromises.push(missingPermissions(f, grantedPerms));

    Promise.all(permissionChecksPromises).then(missingPerms => {
      for (let i = 0; i < permissionChecksFeatures.length; i++)
        if (missingPerms[i].length > 0)
          items[permissionChecksFeatures[i]] = false;

      return items;
    });
  });
}

// Returns a promise which returns the values of options |options| which are
// stored in the sync storage area.
//
// |requireOptionalPermissions| will determine whether to check if the required
// optional permissions have been granted or not to the options which have such
// requirements. If it is true, features with missing permissions will have
// their value set to false.
//
// When a kill switch is active, affected options always have their value set to
// false.

// #!if !production
let timerId = 0;
let randomId = btoa(Math.random().toString()).substr(10, 5);
// #!endif
export function getOptions(options, requireOptionalPermissions = true) {
  // #!if !production
  let timeLabel = 'getOptions--' + randomId + '-' + (timerId++);
  console.time(timeLabel);
  // #!endif
  // Once we only target MV3, this can be greatly simplified.
  return new Promise((resolve, reject) => {
           if (typeof options === 'string')
             options = [options, '_forceDisabledFeatures'];
           else if (Array.isArray(options))
             options = [...options, '_forceDisabledFeatures'];
           else if (options !== null)
             return reject(new Error(
                 'Unexpected |options| parameter of type ' + (typeof options) +
                 ' (expected: string, array, or null).'));

           chrome.storage.sync.get(options, items => {
             if (chrome.runtime.lastError)
               return reject(chrome.runtime.lastError);

             // Handle applicable kill switches which force disable features
             if (items?._forceDisabledFeatures) {
               for (let feature of items?._forceDisabledFeatures) {
                 items[feature] = false;
               }

               delete items._forceDisabledFeatures;
             }

             if (!requireOptionalPermissions) return resolve(items);

             // Check whether some options have missing permissions which would
             // force disable these features
             let permissionChecksFeatures = [];
             for (const [key, value] of Object.entries(items))
               if ((key in optionsPrototype) && value &&
                   optionsPrototype[key].requiredOptPermissions?.length)
                 permissionChecksFeatures.push(key);

             if (permissionChecksFeatures.length == 0) return resolve(items);

             // If we don't have access to the chrome.permissions API (content
             // scripts don't have access to it[1]), do the final piece of
             // computation in the service worker/background script.
             // [1]: https://developer.chrome.com/docs/extensions/mv3/content_scripts/

             // #!if !production
             console.debug('We are about to start checking granted permissions');
             console.timeLog(timeLabel);
             // #!endif
             if (!chrome.permissions) {
               return chrome.runtime.sendMessage(
                   {
                     message: 'runDisableItemsWithMissingPermissions',
                     options: {
                       items,
                       permissionChecksFeatures,
                     },
                   },
                   response => {
                     if (response === undefined)
                       return reject(new Error(
                           'An error ocurred while communicating with the service worker: ' +
                           chrome.runtime.lastError.message));

                     if (response.status == 'rejected')
                       return reject(response.error);
                     if (response.status == 'resolved')
                       return resolve(response.items);
                     return reject(new Error(
                         'An unknown response was recieved from service worker.'));
                   });
             }

             disableItemsWithMissingPermissions(items, permissionChecksFeatures)
                 .then(finalItems => resolve(finalItems))
                 .catch(err => reject(err));
           });
         })
      // #!if !production
      .then(items => {
        console.group('getOptions(options); resolved; options: ', options);
        console.timeEnd(timeLabel);
        console.groupEnd();
        return items;
      })
      .catch(err => {
        console.group('getOptions(options); rejected; options: ', options);
        console.timeEnd(timeLabel);
        console.groupEnd();
        throw err;
      })
      // #!endif
      ;
}

// Returns a promise which returns whether the |option| option/feature is
// currently enabled. If the feature requires optional permissions to work,
// |requireOptionalPermissions| will determine whether to check if the required
// optional permissions have been granted or not.
export function isOptionEnabled(option, requireOptionalPermissions = true) {
  return getOptions(option).then(options => {
    return options?.[option] === true;
  });
}
