/**
 * Describes an item for translation synchronization, including its source,
 * destination, and any necessary transformations.
 */
export interface SyncTranslationItem<T> {
  sourceKey: string;
  destinationKey: string;
  transformation: (value: T) => string;
}

export const LANGUAGE_TRANSFORMATIONS = new Map([
  ['ar', 'ar'],
  ['ca', 'ca'],
  ['de', 'de'],
  ['es', 'es'],
  ['fr', 'fr'],
  ['id', 'id'],
  ['it', 'it'],
  ['ja', 'ja'],
  ['ko', 'ko'],
  ['nl', 'nl'],
  ['pl', 'pl'],
  ['pt_BR', 'pt_BR'],
  ['ru', 'ru'],
  ['th', 'th'],
  ['tr', 'tr'],
  ['vi', 'vi'],
]);

const identity = (value: string) => value;

/**
 * List of languages for which we need translations. The first element
 * is the language codename and the second element is the translation
 * key used in the Community Console.
 */
const LANGUAGES_MAP = [
  { code: 'ar', sourceKey: 'Arabic' },
  { code: 'bg', sourceKey: 'Bulgarian' },
  { code: 'ca', sourceKey: 'Catalan' },
  { code: 'cs', sourceKey: 'Czech' },
  { code: 'da', sourceKey: 'Danish' },
  { code: 'de', sourceKey: 'German' },
  { code: 'el', sourceKey: 'Greek' },
  { code: 'en', sourceKey: 'English' },
  { code: 'en-AU', sourceKey: 'English (Australia)' },
  { code: 'en-GB', sourceKey: 'English (UK)' },
  { code: 'es', sourceKey: 'Spanish' },
  { code: 'es-419', sourceKey: 'Spanish (Latin America)' },
  { code: 'et', sourceKey: 'Estonian' },
  { code: 'fi', sourceKey: 'Finnish' },
  { code: 'fil', sourceKey: 'Filipino' },
  { code: 'fr', sourceKey: 'French' },
  { code: 'hi', sourceKey: 'Hindi' },
  { code: 'hr', sourceKey: 'Croatian' },
  { code: 'hu', sourceKey: 'Hungarian' },
  { code: 'id', sourceKey: 'Indonesian' },
  { code: 'it', sourceKey: 'Italian' },
  { code: 'iw', sourceKey: 'Hebrew' },
  { code: 'ja', sourceKey: 'Japanese' },
  { code: 'ko', sourceKey: 'Korean' },
  { code: 'lt', sourceKey: 'Lithuanian' },
  { code: 'lv', sourceKey: 'Latvian' },
  { code: 'ms', sourceKey: 'Malay' },
  { code: 'nl', sourceKey: 'Dutch' },
  { code: 'no', sourceKey: 'Norwegian (Bokmal)' },
  { code: 'pl', sourceKey: 'Polish' },
  { code: 'pt-BR', sourceKey: 'Portuguese (Brazil)' },
  { code: 'pt-PT', sourceKey: 'Portuguese (Portugal)' },
  { code: 'ro', sourceKey: 'Romanian' },
  { code: 'ru', sourceKey: 'Russian' },
  { code: 'sk', sourceKey: 'Slovak' },
  { code: 'sl', sourceKey: 'Slovenian' },
  { code: 'sr', sourceKey: 'Serbian' },
  { code: 'sv', sourceKey: 'Swedish' },
  { code: 'th', sourceKey: 'Thai' },
  { code: 'tr', sourceKey: 'Turkish' },
  { code: 'uk', sourceKey: 'Ukrainian' },
  { code: 'vi', sourceKey: 'Vietnamese' },
  { code: 'zh-CN', sourceKey: 'Chinese (Simplified)' },
  { code: 'zh-HK', sourceKey: 'Chinese (Hong Kong)' },
  { code: 'zh-TW', sourceKey: 'Chinese (Traditional)' },
];

export const SYNC_TRANSLATIONS: SyncTranslationItem<unknown>[] = [
  {
    sourceKey: 'Cancel',
    destinationKey: 'bulkMove.dialog.cancel',
    transformation: identity,
  },
  {
    sourceKey: 'Close',
    destinationKey: 'bulkMove.progressDialog.close',
    transformation: identity,
  },
  {
    sourceKey: 'Move',
    destinationKey: 'bulkMove.dialog.move',
    transformation: identity,
  },
  {
    sourceKey: 'Category',
    destinationKey: 'components.additionalDetailsPicker.category',
    transformation: identity,
  },
  {
    sourceKey: 'Community Forum (required)',
    destinationKey: 'components.forumPicker.communityForum',
    transformation: (value: string) => value.replace(/\(.*\)/, '').trim(),
  },
  {
    sourceKey: 'Language',
    destinationKey: 'components.forumPicker.language',
    transformation: identity,
  },
  {
    sourceKey: 'Additional details',
    destinationKey: 'components.forumDestinationPicker.additionalDetails',
    transformation: identity,
  },
  {
    sourceKey: 'Destination forum',
    destinationKey: 'components.forumDestinationPicker.destinationForum',
    transformation: identity,
  },
  ...LANGUAGES_MAP.map((language) => {
    return {
      sourceKey: language.sourceKey,
      destinationKey: `languages.${language.code}`,
      transformation: identity,
    };
  }),
];
