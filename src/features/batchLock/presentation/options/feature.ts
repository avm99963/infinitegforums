import { msg } from '@lit/localize';
import { Feature } from '../../../../options/presentation/models/feature';
import { COMMUNITY_CONSOLE_TAG } from '../../../../options/presentation/utils/featureUtils';

export const batchLockFeature = () => new Feature({
  optionCodename: 'batchlock',
  name: msg('Bulk lock', {
    desc: 'Name of an extension feature.',
  }),
  description: msg('Adds a button to lock all selected threads at once.', {
    desc: 'Description of the "Bulk lock" feature.',
  }),
  tags: [COMMUNITY_CONSOLE_TAG()],
});
