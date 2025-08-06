import {optionsPrototype} from './optionsPrototype';
import specialOptions from './specialOptions.json5';

export {optionsPrototype, specialOptions};

// Adds missing options with their default value. If |dryRun| is set to false,
// they are also saved to the sync storage area.
export function cleanUpOptions(options, dryRun = false) {
  console.debug('[cleanUpOptions] Previous options', JSON.stringify(options));

  if (typeof options !== 'object' || options === null) options = {};

  var ok = true;
  for (const [opt, optMeta] of Object.entries(optionsPrototype)) {
    if (!(opt in options) &&
        optMeta['killSwitchType'] !== 'internalKillSwitch') {
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

// #!if !production
let timerId = 0;
let randomId = btoa(Math.random().toString()).substr(10, 5);
// #!endif
/**
 * Returns a promise which returns the values of options |options| which are
 * stored in the sync storage area.
 *
 * |requireOptionalPermissions| will determine whether to check if the required
 * optional permissions have been granted or not to the options which have such
 * requirements. If it is true, features with missing permissions will have
 * their value set to false.
 *
 * When a kill switch is active, affected options always have their value set to
 * false.
 *
 * @deprecated Use OptionsProviderPort.
 */
export function getOptions(options, requireOptionalPermissions = true) {
  // #!if !production
  const timeLabel = 'getOptions--' + randomId + '-' + (timerId++);
  const startMark = `mark_start_get_options_${timeLabel}`;
  const endMark = `mark_end_get_options_${timeLabel}`;
  const measureName = `measure_get_options_${timeLabel}`;
  window.performance.mark(startMark, {detail: {options}});
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
               for (let feature of items._forceDisabledFeatures) {
                 items[feature] = false;
               }

               delete items._forceDisabledFeatures;
             }

             return resolve(items);
           });
         })
      // #!if !production
      .then(items => {
        window.performance.mark(endMark, {detail: {options}});
        window.performance.measure(measureName, {
          detail: {options},
          start: startMark,
          end: endMark,
        });
        return items;
      })
      .catch(err => {
        window.performance.mark(endMark, {detail: {options}});
        window.performance.measure(measureName, {
          detail: {options},
          start: startMark,
          end: endMark,
        });
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
  return getOptions(option, requireOptionalPermissions).then(options => {
    return options?.[option] === true;
  });
}

export function getForceDisabledFeatures() {
  return new Promise((res, rej) => {
    chrome.storage.sync.get('_forceDisabledFeatures', items => {
      if (chrome.runtime.lastError) return rej(chrome.runtime.lastError);
      res(items?.['_forceDisabledFeatures'] ?? []);
    });
  });
}
