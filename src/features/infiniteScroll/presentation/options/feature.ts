import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import { html } from 'lit';

const featureName = msg('Infinite scroll', {
  desc: 'Name of an extension feature.',
});

export const threadListsInfiniteScrollFeature = new Feature({
  optionCodename: 'list',
  name: featureName,
  description: msg('Automatically loads more threads when scrolling down.', {
    desc: 'Description of the "Infinite Scroll" feature in thread lists.',
  }),
  note: msg(
    'The Community Console already has this feature built-in without the need of the extension.',
    { desc: 'Note for the "Infinite scroll" feature for thread lists.' },
  ),
  tags: [TAILWIND_BASIC_TAG],
});

const threadFeatureDescription = msg(
  'Automatically loads more replies when scrolling down.',
  {
    desc: 'Description of the "Infinite Scroll" feature in threads.',
  },
);

// TODO: Merge the following 2 features into one with a suboption.
export const threadsInfiniteScrollInBatchesFeature = new Feature({
  optionCodename: 'thread',
  name: 'Infinite scroll (in batches)',
  description: threadFeatureDescription,
  note: html`
    <b style="color: var(--md-sys-color-error)">IMPORTANT:</b>
    This feature should not be enabled at the same time as "Infinite scroll (all
    at once)".
    <br />
    Both features will be merged before releasing the new options page, with the
    ability to choose one of the two behaviors with a selector.
  `,
  tags: [TAILWIND_BASIC_TAG, COMMUNITY_CONSOLE_TAG],
});

export const threadsInfiniteScrollAllAtOnceFeature = new Feature({
  optionCodename: 'threadall',
  name: 'Infinite scroll (all at once)',
  description: threadFeatureDescription,
  note: html`
    <b style="color: var(--md-sys-color-error)">IMPORTANT:</b>
    This feature should not be enabled at the same time as "Infinite scroll (in
    batches)".
    <br />
    Both features will be merged before releasing the new options page, with the
    ability to choose one of the two behaviors with a selector.
  `,
  tags: [TAILWIND_BASIC_TAG, COMMUNITY_CONSOLE_TAG],
});
