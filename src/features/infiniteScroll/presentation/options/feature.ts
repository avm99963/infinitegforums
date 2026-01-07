import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import { SubOption } from '@/options/presentation/models/subOption';
import threadListDemo from './assets/demo_thread_list.avif';
import threadDemo from './assets/demo_thread.avif';

const featureName = () =>
  msg('Infinite scroll', {
    desc: 'Name of an extension feature.',
  });

export const threadListsInfiniteScrollFeature = () =>
  new Feature({
    optionCodename: 'list',
    name: featureName(),
    description: msg('Automatically loads more threads when scrolling down.', {
      desc: 'Description of the "Infinite Scroll" feature in thread lists.',
    }),
    note: msg(
      'The Community Console already has this feature built-in without the need of the extension.',
      { desc: 'Note for the "Infinite scroll" feature for thread lists.' },
    ),
    demoMedia: {
      imgUrl: threadListDemo,
    },
    tags: [TAILWIND_BASIC_TAG()],
  });

const threadFeatureDescription = () =>
  msg('Automatically loads more replies when scrolling down.', {
    desc: 'Description of the "Infinite Scroll" feature in threads.',
  });

// TODO: Merge the following 2 features into one with a suboption.
export const threadsInfiniteScrollFeature = () =>
  new Feature({
    optionCodename: 'thread',
    name: featureName(),
    description: threadFeatureDescription(),
    subOptions: [
      new SubOption({
        optionCodename: 'thread_mode',
        label: msg('Mode', {
          desc: 'Suboption for the "Infinite scroll" (in threads) feature.',
        }),
        type: {
          type: 'dropdown',
          options: [
            {
              label: msg('In batches', {
                desc: 'Selectable option for the "Mode" suboption of the "Infinite scroll" (in threads) feature.',
              }),
              value: 'in_batches',
            },
            {
              label: msg('All at once', {
                desc: 'Selectable option for the "Mode" suboption of the "Infinite scroll" (in threads) feature.',
              }),
              value: 'all_at_once',
            },
          ],
        },
      }),
    ],
    demoMedia: {
      imgUrl: threadDemo,
    },
    tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
  });
