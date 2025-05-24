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
  ['pl', 'pl'],
  ['pt_BR', 'pt_BR'],
  ['ru', 'ru'],
  ['th', 'th'],
  ['tr', 'tr'],
  ['vi', 'vi'],
]);

const identity = (value: string) => value;

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
];
