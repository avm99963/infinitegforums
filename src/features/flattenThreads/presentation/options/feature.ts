import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const flattenThreadsFeature = new Feature({
  optionCodename: 'flattenthreads',
  name: msg('Flatten replies', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Shows a toggle which lets you disable nested view to display the replies flattened.',
    {
      desc: 'Description of the "Flatten replies" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG],
});
