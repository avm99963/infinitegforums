import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const autoRefreshFeature = new Feature({
  optionCodename: 'autorefreshlist',
  name: msg('Notify updates', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Shows a non-intrusive notification when a thread list has new updates.',
    {
      desc: 'Description of the "Notify updates" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG],
});
