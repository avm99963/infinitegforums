import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import {
  COMMUNITY_CONSOLE_TAG,
  TAILWIND_BASIC_TAG,
} from '../../../../options/presentation/utils/featureUtils';

export const imageMaxHeightFeature = new Feature({
  optionCodename: 'imagemaxheight',
  name: msg('Limit image size', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Prevents inline images in messages from being taller than the current window.',
    { desc: 'Description of the "Limit image size" feature.' },
  ),
  tags: [TAILWIND_BASIC_TAG, COMMUNITY_CONSOLE_TAG],
});
