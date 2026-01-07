import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import screenshot from './assets/screenshot.avif';

export const previousPostsFeature = () =>
  new Feature({
    optionCodename: 'history',
    name: msg('Previous posts', {
      desc: 'Name of an extension feature.',
    }),
    description: msg('Shows a "previous posts" link in user profiles.', {
      desc: 'Description of the "Previous posts" feature.',
    }),
    demoMedia: {
      imgUrl: screenshot,
    },
    tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
  });
