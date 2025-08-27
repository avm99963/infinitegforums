import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const repositionExpandThreadFeature = new Feature({
  optionCodename: 'repositionexpandthread',
  name: msg('Place expand button in the left', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Places the "expand thread" button all the way to the left.',
    {
      desc: 'Description of the "Place expand button in the left" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG],
});
