import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const increaseContrastFeature = new Feature({
  optionCodename: 'increasecontrast',
  name: msg('Increase contrast', {
    desc: 'Name of an extension feature.',
  }),
  description: msg(
    'Increases contrast between the background of read and unread threads.',
    {
      desc: 'Description of the "Increase contrast" feature.',
    },
  ),
  tags: [COMMUNITY_CONSOLE_TAG],
});
