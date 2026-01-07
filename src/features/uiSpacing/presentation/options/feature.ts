import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';
import screenshot from './assets/screenshot.avif';

export const uiSpacingFeature = () =>
  new Feature({
    optionCodename: 'uispacing',
    name: msg('Compact mode', {
      desc: 'Name of an extension feature.',
    }),
    description: msg('Reduce the whitespace in the UI.', {
      desc: 'Description of the "Compact mode" feature.',
    }),
    demoMedia: {
      imgUrl: screenshot,
    },
    tags: [TAILWIND_BASIC_TAG(), COMMUNITY_CONSOLE_TAG()],
  });
