import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const fixedToolbarFeature = new Feature({
  optionCodename: 'fixedtoolbar',
  name: msg('Sticky bulk actions toolbar', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Makes the toolbar not disappear when scrolling down.', {
    desc: 'Description of the "Sticky bulk actions toolbar" feature.',
  }),
  tags: [COMMUNITY_CONSOLE_TAG],
});
