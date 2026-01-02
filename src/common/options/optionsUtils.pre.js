import {optionsPrototype} from './optionsPrototype';
import { getSyncStorageAreaRepository } from '@/storage/compositionRoot';

const specialOptions = [
  'profileindicatoralt_months',
  'ccdarktheme_mode',
  'ccdarktheme_switch_status',
  'interopthreadpage_mode',
];

export {optionsPrototype, specialOptions};

// NOTE: We are assuming that the functions inside this file are only called
// from contexts with access to the chrome.storage API (i.e., no main world
// script calls functions in this file).
const syncStorageAreaRepository = getSyncStorageAreaRepository();

/**
 * Returns a promise which returns the values of options |options| which are
 * stored in the sync storage area.
 *
 * When a kill switch is active, affected options always have their value set to
 * false.
 *
 * @deprecated Use OptionsProviderPort.
 */
export async function getOptions(options) {
  // #!if !defined(PRODUCTION)
  console.debug('A call has been made to deprecated function getOptions().');
  // #!endif

  // Detect if the assumption that we have access to the chrome.storage API was
  // wrong.
  if (chrome?.storage?.sync?.get === undefined) {
    console.error('CRITICAL: chrome.storage is not accessible from this call to getOptions().');
    // Safe fail so that the extension doesn't fully break, but all options are
    // not set, so they will be treated as disabled (this is better than a full
    // break).
    return {};
  }

  if (typeof options === 'string')
    options = [options, '_forceDisabledFeatures'];
  else if (Array.isArray(options))
    options = [...options, '_forceDisabledFeatures'];
  else if (options !== null)
    return reject(new Error(
        'Unexpected |options| parameter of type ' + (typeof options) +
        ' (expected: string, array, or null).'));

  const items = await syncStorageAreaRepository.get(options);

  // Handle applicable kill switches which force disable features
  if (items?._forceDisabledFeatures) {
    for (let feature of items._forceDisabledFeatures) {
      items[feature] = false;
    }

    delete items._forceDisabledFeatures;
  }

  return items;
}

// Returns a promise which returns whether the |option| option/feature is
// currently enabled.
export function isOptionEnabled(option) {
  return getOptions(option).then(options => {
    return options?.[option] === true;
  });
}
