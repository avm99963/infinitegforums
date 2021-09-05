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

// Returns a promise which returns the values of options |options| which are
// stored in the sync storage area.
export function getOptions(options) {
  // Once we only target MV3, this can be greatly simplified.
  return new Promise((resolve, reject) => {
    if (typeof options === 'string')
      options = [options, '_forceDisabledFeatures'];
    else if (typeof options === 'array')
      options = [...options, '_forceDisabledFeatures'];
    else if (options !== null)
      console.error('Unexpected |options| parameter (expected: string, array, or null).');

    chrome.storage.sync.get(options, items => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);

      // Handle applicable kill switches which force disable features
      if (items?._forceDisabledFeatures) {
        for (let feature of items?._forceDisabledFeatures) {
          items[feature] = false;
        }

        delete items._forceDisabledFeatures;
      }

      resolve(items);
    });
  });
}

// Returns a promise which returns whether the |option| option/feature is
// currently enabled.
export function isOptionEnabled(option) {
  return getOptions(option).then(options => {
    return options?.[option] === true;
  });
}
