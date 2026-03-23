import { msg } from '@lit/localize';
import { Feature } from '@/options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '@/options/presentation/utils/featureUtils';
import demo from './assets/demo.avif';

export const replySoftLockFeature = () =>
  new Feature({
    optionCodename: 'replysoftlock',
    name: msg('Soft lock when replying', {
      desc: 'Name of an extension feature.',
    }),
    description: msg(
      'Adds the option to soft lock the current thread in the reply editor.',
      {
        desc: 'Description of the "Soft lock when replying" feature.',
      },
    ),
    demoMedia: {
      imgUrl: demo,
    },
    tags: [COMMUNITY_CONSOLE_TAG()],
  });
